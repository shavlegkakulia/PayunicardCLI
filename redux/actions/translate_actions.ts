import { FETCH_TRANSLATE, SET_LOADING } from './../action_types/translate_action_types';
import Langs from './../../lang/index';

export const use = (key: string) => (dispatch: any) => {
    dispatch({type: SET_LOADING, isLoading: true});
    dispatch({type: FETCH_TRANSLATE, translates: Langs[key], key: key});
    dispatch({type: SET_LOADING, isLoading: false});
}

export const setKey = (key: string) => (dispatch: any) => {
    dispatch({type: FETCH_TRANSLATE, key: key});
}