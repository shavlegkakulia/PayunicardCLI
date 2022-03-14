import axios, { AxiosRequestConfig } from 'axios';
import { from } from 'rxjs';
import storage from './../services/StorageService';
import { IErrorAction, PUSH_ERROR } from './../redux/action_types/error_action_types';
import envs from './../config/env';
import { stringToObject } from '../utils/utils';
import { invalid_username_or_password, otp_not_valid, require_otp } from '../constants/errorCodes';
import Store from './../redux/store';
import { IAuthAction, REFRESH, SET_DEVICE_ID } from '../redux/action_types/auth_action_types';
import { AUTH_USER_INFO, DEVICE_ID, TOKEN_EXPIRE } from '../constants/defaults';
import DeviceInfro from 'react-native-device-info';
import { getString } from '../utils/Converter';

declare module 'axios' {
  interface AxiosRequestConfig {
    anonymous?: boolean;
    fromLogin?: boolean;
    objectResponse?: boolean;
    skipRefresh?: boolean;
  }
}

export interface IAuthorizationRequest {
  username?: string;
  password: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
  grant_type?: string;
  otp?: any;
}

export interface IAuthorizationResponse {
  userId?: number | undefined;
  refresh_token: string;
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  requireOtp?: boolean;
  errors?: string[] | undefined;
  ok?: boolean;
}

export interface IRegisterRequest {
  userName: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  otpGuid: string;
  isApplyTerms: string | number;
  name: string;
  surname: string;
  birthDate: any;
  personalId: string;
  citizenshipCountryID?: number;
}

export interface IRegisterResponse {
  ok: boolean;
  errors: any[];
  data: any;
}

class AuthService {
  constructor() {
    DeviceInfro.getUserAgent().then(r => {
      this.DeviceData = JSON.stringify({
        deviceId: DeviceInfro.getDeviceId(),
        userAgent: r
      })
    })
  }
  DeviceData: string = '';
  refreshStarted: boolean = false;

  async getToken(): Promise<string | null> {
    return await storage.getItem('access_token');
  }

  async getRefreshToken(): Promise<string | null> {
    return await storage.getItem('refresh_token');
  }

  async isAuthenticated(): Promise<boolean | null> {
    let token = await this.getToken();
    let refreshToken = await this.getRefreshToken();

    return token != null || refreshToken != null;
  }

  async setToken(token: string, refreshToken: string): Promise<void> {
    await storage.setItem('access_token', token);

    if (refreshToken !== undefined) {
      storage.setItem('refresh_token', refreshToken);
    }
  }

  async removeToken(): Promise<void> {
    await storage.removeItem('access_token');
    await storage.removeItem('refresh_token');
  }

  SignIn({ User }: { User: IAuthorizationRequest }) {
    const loginObj = new FormData();
    loginObj.append("username", User.username);
    loginObj.append("password", User.password);
    loginObj.append("scope", "Wallet_Api.Full offline_access");
    loginObj.append("client_id", envs.client_id);
    loginObj.append("client_secret", envs.client_secret);
    loginObj.append("grant_type", "password");
    if(User.otp) {
      loginObj.append("otp", User.otp.toString());
    }

    //cleare remember data if current user is different
      storage
        .getItem(AUTH_USER_INFO)
        .then(async(user) => {
          if(user) {
            const rememberData = JSON.parse(user);
            if(rememberData && rememberData?.username !== User.username) {
              await storage.removeItem(AUTH_USER_INFO);
            }
          }
        });
  
   
    const promise = axios.post<IAuthorizationResponse>(`${envs.CONNECT_URL}connect/token`, loginObj, { fromLogin: true, objectResponse: true, skipRefresh: true });
    return from(promise);
  }

  SignUp({ User }: { User: IRegisterRequest }) {
    const promise = axios.post<IRegisterResponse>(`${envs.API_URL}User/UserPreRegistration`, User, { objectResponse: true });
    return from(promise);
  }

  async SignOut(): Promise<void> {
    await this.removeToken();
  }

  registerAuthInterceptor(callBack: () => void) {
    storage.getItem(DEVICE_ID).then(data => {
      if(data !== null) {
        Store.dispatch<IAuthAction>({type: SET_DEVICE_ID, deviceId: getString(data)});
      }
    })
    const setAuthToken = async (config: AxiosRequestConfig) => {
      config.headers = config.headers || {};
      let { accesToken } = Store.getState().AuthReducer;

      if (accesToken) {
        config.headers.Authorization = `Bearer ${accesToken}`;
      }

        config.headers['User-Agent'] = this.DeviceData;
        config.headers['appVersion'] = DeviceInfro.getVersion();
    };

    const waitForRefresh = (config?: AxiosRequestConfig) => {
      return new Promise(resolve => {
        let interval = setInterval(() => {
          if (this.refreshStarted) return;

          clearInterval(interval);
          resolve(config);
        }, 500);
      });
    };

    //add auth header
    let requestInterceptor = axios.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        let { accesToken, isAuthenticated, deviceId } = Store.getState().AuthReducer;
        if(deviceId) {
          config.headers['x-device-id'] = deviceId;
        }
        
        if (isAuthenticated && !config.anonymous) {
          //if refreshStarted wait
          if (this.refreshStarted && !config.skipRefresh) {
            return waitForRefresh(config).then(async (config: any) => {
              if (!accesToken)
                return Promise.reject({ status: 401 });
              await setAuthToken(config);
              return Promise.resolve(config);
            });
          }

          await setAuthToken(config);
        }
        return config;
      },
    );

    // if unauthorized refetch
    let responseInterceptor = axios.interceptors.response.use(
      response => {
        return response;
      },
      async (error: any) => {
        let { refreshToken } = Store.getState().AuthReducer || await this.getRefreshToken();
        const stringTranslator = Store.getState().TranslateReduser;
        error.response = error.response || {};

        //Reject promise if usual error
        if (
          (error?.response?.status !== 401 &&
            error?.response?.status !== 403
            ) ||
          error.config.anonymous ||
          error.config.skipRefresh
        ) {
          if (error?.response?.status === 500 || error?.response?.status === 400){
            error.message = stringTranslator.t("generalErrors.errorOccurred");
          }

          if (stringToObject(error.response).data.error_description === invalid_username_or_password) {
            Store.dispatch<IErrorAction>({ type: PUSH_ERROR, error: 'Invalid Username or Password' });
            return Promise.reject(error);
          }

            if (stringToObject(error.response).data.error_description === otp_not_valid) {
              Store.dispatch<IErrorAction>({ type: PUSH_ERROR, error: otp_not_valid });
              return Promise.reject(error);
            }
        
          if (stringToObject(error.response).data.error !== require_otp && stringToObject(error.response).data.error !== invalid_username_or_password) {
            Store.dispatch<IErrorAction>({ type: PUSH_ERROR, error: error.message || error.errorMessage });
          }

          return Promise.reject(error);
        }
        const originalRequest = error.config;
        //if refresh already started wait and retry with new token
        if (this.refreshStarted) {
          return waitForRefresh().then(async _ => {
            if (!refreshToken) return Promise.reject({ status: 401 });
            setAuthToken(originalRequest);
            return axios(originalRequest);
          });
        }

        const isPassCodeEnabled = await storage.getItem('PassCodeEnbled');
        
        //refresh token
        this.refreshStarted = true;
        const refreshObj = new FormData();
        refreshObj.append('scope', 'Wallet_Api.Full offline_access');
        refreshObj.append('grant_type', 'refresh_token');
        refreshObj.append("client_id", envs.client_id);
        refreshObj.append("client_secret", envs.client_secret);
        refreshObj.append('refresh_token', refreshToken);
        return axios
          .post<IAuthorizationResponse>(`${envs.CONNECT_URL}connect/token`, refreshObj, { anonymous: true })
          .then(async response => {
            if (!response.data.access_token) throw response;
            if(isPassCodeEnabled !== null) {
              await this.removeToken();
              await this.setToken(
                response.data.access_token,
                response.data.refresh_token,
              );
            }

            const date = new Date();
            date.setSeconds(date.getSeconds() + response.data.expires_in);
            const expObject = {
              expDate: date,
            };
            await storage.removeItem(TOKEN_EXPIRE);
            await storage.setItem(TOKEN_EXPIRE, JSON.stringify(expObject));

            Store.dispatch<IAuthAction>({
              type: REFRESH,
              accesToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
            });

            this.refreshStarted = false;

            setAuthToken(originalRequest);
            return axios(originalRequest);
          })
          .catch(err => {
            this.refreshStarted = false;

            callBack();
            return Promise.reject(err);
          });
      },
    );

    return {
      unsubscribe: () => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
      },
    };
  }
}

export interface IInterceptop {
  unsubscribe: () => void;
}

export default new AuthService();