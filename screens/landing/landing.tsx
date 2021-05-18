import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Colors from '../../constants/colors';
import LandingLayout from '../LandingLayout';
import FirstLoad from './firstLoad';
import { useNavigation } from '@react-navigation/native';

const Main: React.FC = (props) => {
    const navigation = useNavigation();
    const [firstLoad, setFirstsLoad] = useState(true);

    if(firstLoad) {
        return <View style={{flex: 1}}>
            <FirstLoad />
        </View>
    }

    return (
        <LandingLayout>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Landing Screen
                </Text>
              


                <Button title="Login" onPress={() => navigation.navigate("Login")} />
                <Button title="Signup" onPress={() => navigation.navigate("Signup")} />
            </View>
        </LandingLayout>
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