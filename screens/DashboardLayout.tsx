import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import Colors from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from './../redux/actions/auth_actions';
import { FetchUserDetail } from './../redux/actions/user_actions';
import { IUserState } from './../redux/action_types/user_action_types';
import { ITranslateState, IGlobalState as ITranslateGlobalState } from './../redux/action_types/translate_action_types';

interface IState {
    UserReducer: IUserState
}

const DashboardLayout: React.FC = (props) => {
    const dispatch = useDispatch();
    const state = useSelector<IState>(state => state.UserReducer) as IUserState;
    const translate = useSelector<ITranslateGlobalState>(state => state.TranslateReduser) as ITranslateState;

    const logout = async () => {
        await dispatch(Logout());
    }

    useEffect( () => {
         dispatch(FetchUserDetail());
    }, [])
    
    return (
        <View style={style.container}>
            <Button title={translate.t('common.logout')} onPress={logout} />
            {state.isLoading ? <View><ActivityIndicator size="small" color="#0000ff" /></View> : <Text>{state.userDetails?.username}</Text>}
            {props.children}
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.success
    }
})

export default DashboardLayout;