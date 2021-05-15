import { LOGIN, LOGOUT, START_LOGIN, IAuthState, IAuthAction } from '../action_types/auth_action_types';

const initialState: IAuthState = {
    isAuthenticated: false,
    isLoading: false,
    accesToken: ""
}

function AuthReduser (state: IAuthState = initialState, action: IAuthAction) {
    switch(action.type) {
        case START_LOGIN:
            return { ...state, isLoading: action.isLoading }
        case LOGIN: 
            return { ...state, isAuthenticated: true, accesToken: action.accesToken }
        case LOGOUT: 
            return { ...state, isAuthenticated: false, accesToken: "" }
        default:
            return { ...state }
    }
}

export default AuthReduser;