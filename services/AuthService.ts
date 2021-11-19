import axios, { AxiosRequestConfig } from 'axios';
import { from } from 'rxjs';
import storage from './../services/StorageService';
import store from './../redux/store';
import { IErrorAction, PUSH_ERROR } from './../redux/action_types/error_action_types';
import envs from './../config/env';
import { stringToObject } from '../utils/utils';
import { invalid_username_or_password, otp_not_valid, require_otp } from '../constants/errorCodes';

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
  expires_in: Number;
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
}

export interface IRegisterResponse {
  ok: boolean;
  errors: any[];
  data: any;
}

class AuthService {
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
    loginObj.append("client_id", "WalletApi");
    loginObj.append("client_secret", "abcd123");
    loginObj.append("grant_type", "password");
    if(User.otp) {
      loginObj.append("otp", User.otp.toString());
    }
   
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
    const setAuthToken = async (config: AxiosRequestConfig) => {
      config.headers = config.headers || {};
      let token = await this.getToken();
      if (token)
        config.headers.Authorization = `Bearer ${token}`;
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
        if (await this.isAuthenticated() && !config.anonymous) {
          //if refreshStarted wait
          if (this.refreshStarted && !config.skipRefresh) {
            return waitForRefresh(config).then(async (config: any) => {
              if (!(await this.getToken()))
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
        //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@', response)
        return response;
      },
      async (error: any) => {
        //  console.log('error', error);
        //console.log('+++++++++error in auth interceptor++++++++++', JSON.stringify(error.response), JSON.parse(JSON.stringify(error.response)).data.error)
        error.response = error.response || {};

        //Reject promise if usual error
        if (
          (error?.response?.status !== 401 &&
            error?.response?.status !== 403
            // &&
            //error?.response?.status !== 400
            ) ||
          error.config.anonymous ||
          error.config.skipRefresh
        ) {
          if (error?.response?.status === 500){
            error.message = 'Something went wrong';
          }

          if (error?.response?.status === 400){
            error.message = 'Something not found';
          }

          if (stringToObject(error.response).data.error_description === invalid_username_or_password) {
            store.dispatch<IErrorAction>({ type: PUSH_ERROR, error: 'Invalid Username or Password' });
            return Promise.reject(error);
          }

            if (stringToObject(error.response).data.error_description === otp_not_valid) {
              store.dispatch<IErrorAction>({ type: PUSH_ERROR, error: otp_not_valid });
              return Promise.reject(error);
            }
        
          if (stringToObject(error.response).data.error !== require_otp) {
            store.dispatch<IErrorAction>({ type: PUSH_ERROR, error: error.message || error.errorMessage });
          }

          return Promise.reject(error);
        }
        const originalRequest = error.config;
        //if refresh already started wait and retry with new token
        if (this.refreshStarted) {
          return waitForRefresh().then(async _ => {
            if (!(await this.getToken())) return Promise.reject({ status: 401 });
            setAuthToken(originalRequest);
            return axios(originalRequest);
          });
        }

        //refresh token
        this.refreshStarted = true;
        const refreshObj = new FormData();
        refreshObj.append('scope', 'Wallet_Api.Full offline_access');
        refreshObj.append('client_id', 'WalletApi');
        refreshObj.append('client_secret', 'abcd123');
        refreshObj.append('grant_type', 'refresh_token');
        refreshObj.append('refresh_token', await this.getRefreshToken());
        return axios
          .post<IAuthorizationResponse>(`${envs.CONNECT_URL}connect/token`, refreshObj, { anonymous: true })
          .then(async response => {
            if (!response.data.access_token) throw response;
            await this.setToken(
              response.data.access_token,
              response.data.refresh_token,
            );

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