import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignupForm: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View>
            <Text>Signup</Text>
            <View>
                <TextInput value="" placeholder="email" onChangeText={() => {}} />
                <TextInput value="" placeholder="password" onChangeText={() => {}} />
                <TextInput value="" placeholder="Repeat password" onChangeText={() => {}} />
                <Button title="SIGNUP" onPress={() => {console.log('signup')}} />
                <Button title="LOGIN" onPress={() => navigation.navigate("Login")} />
            </View>
        </View>
    )
}

export default SignupForm;