import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import store from './../redux/store';
import {
  IErrorAction,
  PUSH_ERROR,
} from './../redux/action_types/error_action_types';
import {ka_ge, LANG_KEYS} from '../lang';
import {stringToObject} from '../utils/utils';
import {invalid_grant, invalid_username_or_password, require_otp} from '../constants/errorCodes';
import Store from './../redux/store';
import DeviceInfro from 'react-native-device-info';

class CommonService {
  constructor() {
    DeviceInfro.getUserAgent().then(r => {
      this.DeviceData = JSON.stringify({
        deviceId: DeviceInfro.getDeviceId(),
        userAgent: r
      })
    })
  }
  DeviceData: string = '';
  uactionIntervals: Array<number> = [];
  ttlIntervals: Array<NodeJS.Timeout> = [];
  //register common interseptors for normalzing response
  //when objectResponse is passed in config returns noly ObjectResponse
  registerCommonInterceptor() {
    let requestInterceptor = axios.interceptors.request.use(config => {
      let langKey = store.getState().TranslateReduser.key || ka_ge;
      config.headers['langcode'] = LANG_KEYS[langKey];
      config.headers['User-Agent'] = this.DeviceData;
      config.headers['appVersion'] = DeviceInfro.getVersion();

      return config;
    });

    let responseInterceptor = axios.interceptors.response.use(
      (response: any) => {
        const stringTranslator = Store.getState().TranslateReduser;
        if (!response.config.objectResponse || response.data.expires_in)
          return Promise.resolve(response);

        if (!response.data.ok && !response.data.Ok) {
          try{
            response.errorMessage =
            response?.data?.errors[0]?.ErrorMessage || response?.data?.errors[0]?.displayText || 'generalErrors.errorOccurred';
            }
            catch(err) {
              response.errorMessage =
              response?.data?.Errors[0]?.DisplayText || 'generalErrors.errorOccurred';
            }
          response.customError = true;
          if (!response.config.skipCustomErrorHandling)
            store.dispatch<IErrorAction>({
              type: PUSH_ERROR,
              error: response.errorMessage === 'generalErrors.errorOccurred' ? stringTranslator.t(response.errorMessage) : response.errorMessage,
            });

          return Promise.reject(response);
        }
        return Promise.resolve(response);
      },
      async error => {
        if(error?.response?.status === 401) {
          return Promise.reject(error);
        }
       // console.log('*****error in common interceptor******', error);
      //  console.log('*****error in common interceptor******', error.toJSON());
        const stringTranslator = Store.getState().TranslateReduser;
        let netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          if (!error.config.skipCustomErrorHandling)
            store.dispatch<IErrorAction>({
              type: PUSH_ERROR,
              error: stringTranslator.t("generalErrors.netError"),
            });
          error.errorMessage = stringTranslator.t("generalErrors.netError");
        } else {
          if (stringToObject(error.response).data.error !== invalid_grant && stringToObject(error.response).data.error !== require_otp && stringToObject(error.response).data.error !== invalid_username_or_password) {
            store.dispatch<IErrorAction>({
              type: PUSH_ERROR,
              error: stringTranslator.t("generalErrors.errorOccurred")
            });
          }
        }
        return Promise.reject(error);
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

export default new CommonService();
