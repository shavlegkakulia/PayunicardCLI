import { LOGIN, LOGOUT, START_LOGIN } from './../action_types/auth_action_types';
import AuthService from './../../services/AuthService';
import AsyncStorage from '@react-native-community/async-storage';

export const Login = (username: string, password: string) => async(dispatch: any) => {
    dispatch({type: START_LOGIN, isLoading: true });
    AuthService.SignIn(username, password).subscribe(async(response) => { 
        await AsyncStorage.setItem("access_token", response.data.access_token);
        dispatch({type: LOGIN, accesToken: response.data.access_token});
    }, error => {
        
    });
    dispatch({type: START_LOGIN, isLoading: false });
}

export const Logout = () => async(dispatch: any) => {
    dispatch({type: START_LOGIN, isLoading: true });
    await AsyncStorage.removeItem("access_token");
    dispatch({type: LOGOUT});
    dispatch({type: START_LOGIN, isLoading: false });
}