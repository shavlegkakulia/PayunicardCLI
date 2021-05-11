import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export interface ScreenProps {
    onGo: () => void
};

const SignupForm: React.FC<ScreenProps> = (props) => {
    return (
        <View>
            <Text>Signup</Text>
            <View>
                <TextInput value="" placeholder="email" onChangeText={() => {}} />
                <TextInput value="" placeholder="password" onChangeText={() => {}} />
                <TextInput value="" placeholder="Repeat password" onChangeText={() => {}} />
                <Button title="SIGNUP" onPress={() => {console.log('signup')}} />
                <Button title="LOGIN" onPress={props.onGo} />
            </View>
        </View>
    )
}

export default SignupForm;