import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';

const Login = () => {
    return (
        <View style={styles.container}>
            <Text>
                Login
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Login;