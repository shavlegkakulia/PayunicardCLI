import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import LandingLayout from '../LandingLayout';
import FirstLoad from './firstLoad';
import Login from './login';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../../constants/colors';

const Main: React.FC = () => {
    const [firstLoad, setFirstsLoad] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const complateFirstLoad = async () => {
        await AsyncStorage.setItem('isFirstLoad', '0');
        setFirstsLoad(false);
    }

    const isFirstLoad = async () => {
        return await AsyncStorage.getItem('isFirstLoad') === null;
    }

    useEffect(() => {
        isFirstLoad().then(status => {
            setFirstsLoad(status);
            setIsLoading(false);
        })
    }, [])

    if (isLoading) {
        return <View>
            <ActivityIndicator />
        </View>
    }

    if (firstLoad) {
        return <View style={{ flex: 1 }}>
            <FirstLoad Complate={complateFirstLoad} />
        </View>
    }

    return (
        <LandingLayout>
            <View style={styles.container}>
               <Login />
            </View>
        </LandingLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    }
})

export default Main;