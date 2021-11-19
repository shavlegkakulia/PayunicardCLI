export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const START_LOGIN = 'START_LOGIN';
export const AUT_SET_IS_LOADING = 'AUT_SET_IS_LOADING';

export interface IAuthState {
    isAuthenticated: boolean,
    isLoading: boolean,
    accesToken: string,
    remember: boolean
}

export interface IAuthAction {
    isLoading: boolean,
    accesToken: string,
    type: string,
    remember: boolean
}

export interface IGlobalState {
    AuthReducer: IAuthState
}