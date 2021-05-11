import React, {useState} from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import NavigationService from '../../services/NavigationService';
import AsyncStorage from '@react-native-community/async-storage';

export interface ScreenProps {
    onGo: () => void
};


const LoginForm = (props: ScreenProps) => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const login = async() => {
        await AsyncStorage.setItem("userToken", username+password);
        NavigationService.navigate("Dashboard");
    }
    return (
        <View>
            <Text>Login</Text>
            <View>
                <TextInput value={username} placeholder="email" onChangeText={(username) => {setUserName(username)}} />
                <TextInput value={password} placeholder="password" onChangeText={(password) => {setPassword(password)}} />
                <Button title="LOGIN" onPress={login} />
                <Button title="SIGNUP" onPress={props.onGo} />
            </View>
        </View>
    )
}

export default LoginForm;