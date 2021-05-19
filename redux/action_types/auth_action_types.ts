export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const START_LOGIN = 'START_LOGIN';

export interface IAuthState {
    isAuthenticated: boolean,
    isLoading: boolean,
    accesToken: string
}

export interface IAuthAction {
    isLoading: boolean,
    accesToken: string,
    type: string
}

export interface IGlobalState {
    AuthReducer: IAuthState
}