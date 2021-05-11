import React from 'react'
import { View, StatusBar, ActivityIndicator, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationScreenProp } from 'react-navigation';
export interface HomeScreenProps {
    navigation: NavigationScreenProp<any,any>
  };

export default class AuthLoadingScreen extends React.Component {

    constructor(props: HomeScreenProps) {
        super(props);
        this._bootstrap(props);
    }

    _bootstrap = async (props: HomeScreenProps) => {

        const userToken = await AsyncStorage.getItem('userToken');
        console.log(userToken)
        props.navigation.navigate(userToken ? 'App' : 'Main');
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});