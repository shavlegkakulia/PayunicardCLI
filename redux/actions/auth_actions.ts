import {LOGIN, LOGOUT, START_LOGIN} from './../action_types/auth_action_types';
import AuthService from './../../services/AuthService';
import storage from './../../services/StorageService';

export const Login =
  (access_token: string, refresh_token: string, remember: boolean) =>
  async (dispatch: any) => {
    dispatch({type: START_LOGIN, isLoading: true});
    const isPassCodeEnabled = await storage.getItem('PassCodeEnbled');
    if (isPassCodeEnabled !== null) {
      await AuthService.removeToken();
      await AuthService.setToken(access_token, refresh_token);
    }
    dispatch({
      type: LOGIN,
      accesToken: access_token,
      refreshToken: refresh_token,
      remember,
    });
    dispatch({type: START_LOGIN, isLoading: false});
  };

export const Logout = () => (dispatch: any) => {
  dispatch({type: START_LOGIN, isLoading: true});
  //await AuthService.SignOut();
  dispatch({type: LOGOUT});
  dispatch({type: START_LOGIN, isLoading: false});
};
