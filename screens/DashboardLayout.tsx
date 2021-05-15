import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import Colors from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from './../redux/actions/auth_actions';
import { FetchUserDetail } from './../redux/actions/user_actions';
import { IUserState } from './../redux/action_types/user_action_types';

interface IState {
    UserReducer: IUserState
}

const DashboardLayout: React.FC = (props) => {
    const dispatch = useDispatch();
    const state = useSelector<IState>(state => state.UserReducer) as IUserState;

    const logout = async () => {
        await dispatch(Logout());
    }

    useEffect( () => {
         dispatch(FetchUserDetail());
    }, [])
    
    return (
        <View style={style.container}>
            <Button title="logout" onPress={logout} />
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