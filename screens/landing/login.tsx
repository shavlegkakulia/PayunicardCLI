import React, {useState} from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Login } from './../../redux/actions/auth_actions';

const LoginForm:React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [username, setUserName] = useState("Avtandil@test.com");
    const [password, setPassword] = useState("As123123!");

    const login = async() => {
        await dispatch(Login(username, password));
    }

    return (
        <View>
            <Text>Login</Text>
            <View>
                <TextInput value={username} placeholder="email" onChangeText={(username) => {setUserName(username)}} />
                <TextInput value={password} placeholder="password" onChangeText={(password) => {setPassword(password)}} />
                <Button title="LOGIN" onPress={login} />
                <Button title="SIGNUP" onPress={() => navigation.navigate('Signup')} /> 
            </View>
        </View>
    )
}

export default LoginForm;