import { IUserState, IUserAction, START_FETCHING, FETCH_USER_DETAILS } from './../action_types/user_action_types';;

const initalState: IUserState = {
    userDetails: undefined,
    isLoading: false
}

function UserReducer (state = initalState, action: IUserAction) {
    switch(action.type) {
        case START_FETCHING: 
            return { ...state, isLoading: action.isLoading }
        case FETCH_USER_DETAILS:
            return { ...state, userDetails: action.userDetails }
        default:
             return { ...state }
    }
}

export default UserReducer;