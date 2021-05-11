import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Colors from './../constants/colors';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from './../services/NavigationService';

const DashboardLayout:React.FC = (props) => {
    const logout = async() => {
        await AsyncStorage.removeItem("userToken");
        NavigationService.navigate("Main");
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