import { IData } from './../../interfaces/responses/IUserResponse';
export const FETCH_USER_DETAILS = 'FETCH_USER_DETAILS';
export const START_FETCHING = 'START_FETCHING';

export interface IUserState {
    userDetails?: IData;
    isLoading: boolean;
}

export interface IUserAction {
    userDetails: IData;
    isLoading: boolean;
    type: string;
}
