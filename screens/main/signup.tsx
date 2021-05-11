import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';

const Signup = () => {
    return (
        <View style={styles.container}>
            <Text>
                Signup
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

export default Signup;