import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Colors from '../constants/colors';
import { useDispatch } from 'react-redux';
import { Logout } from './../redux/actions/auth_actions';

const DashboardLayout: React.FC = (props) => {
    const dispatch = useDispatch();
    const logout = async () => {
        await dispatch(Logout());
    }
    return (
        <View style={style.container}>
            <Button title="logout" onPress={logout} />
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