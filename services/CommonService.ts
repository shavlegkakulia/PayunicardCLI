import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import store from './../redux/store';
import {
  IErrorAction,
  PUSH_ERROR,
} from './../redux/action_types/error_action_types';
import {ka_ge, LANG_KEYS} from '../lang';
import {stringToObject} from '../utils/utils';
import {require_otp} from '../constants/errorCodes';

class CommonService {
  //register common interseptors for normalzing response
  //when objectResponse is passed in config returns noly ObjectResponse
  registerCommonInterceptor() {
    let requestInterceptor = axios.interceptors.request.use(config => {
      let langKey = store.getState().TranslateReduser.key || ka_ge;
      config.headers['langcode'] = LANG_KEYS[langKey];
      return config;
    });

    let responseInterceptor = axios.interceptors.response.use(
      (response: any) => {
        if (!response.config.objectResponse || response.data.expires_in)
          return Promise.resolve(response);

        if (!response.data.ok && !response.data.Ok) {
          response.errorMessage =
            response?.data?.errors[0]?.displayText || 'validation.error';
          response.customError = true;
          if (!response.config.skipCustomErrorHandling)
            store.dispatch<IErrorAction>({
              type: PUSH_ERROR,
              error: response.errorMessage,
            });

          return Promise.reject(response);
        }
        return Promise.resolve(response);
      },
      async error => {
        console.log('*****error in common interceptor******', error);
        let netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          if (!error.config.skipCustomErrorHandling)
            store.dispatch<IErrorAction>({
              type: PUSH_ERROR,
              error: 'no internet connection',
            });
          error.errorMessage = 'No internet connection';
        } else {
          //error.errorMessage = "error";
          if (stringToObject(error.response).data.error !== require_otp) {
            store.dispatch<IErrorAction>({
              type: PUSH_ERROR,
              error: error.message,
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
