import React, {useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Colors from '../../constants/colors';
import MainLayout from '../../screens/MainLayout';
import { NavigationScreenProp } from 'react-navigation';
import LoginForm from './../../components/auth/Login';
import SignupForm from './../../components/auth/Signup';

const Main:React.FC = (props) => {
    const [formVariant, setFormVariant] = useState(1);
    return (
        <MainLayout>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Main Screen
                </Text>
                {formVariant === 1? <LoginForm onGo={() => setFormVariant(2)} /> : <SignupForm onGo={() => setFormVariant(1)} />}
            </View>
        </MainLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        color: Colors.danger, 
        fontFamily: 'FiraGO-Bold'
    }
})

export default Main;