import { FETCH_USER_DETAILS, START_FETCHING } from './../action_types/user_action_types';
import UserService from './../../services/UserService';

export const FetchUserDetail = () => async (dispatch: any) => {
    await dispatch({ type: START_FETCHING, isLoading: true });
    UserService.GetUserDetails().subscribe(async (response) => {
        await dispatch({ type: FETCH_USER_DETAILS, userDetails: response.data.data });
    });
    await dispatch({ type: START_FETCHING, isLoading: false });
}