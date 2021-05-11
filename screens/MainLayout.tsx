import React, { ReactChildren, ReactChild } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AuxProps {
    children: ReactChild | ReactChildren;
}

const MainLayout = ({children}: AuxProps) => {
    return (
        <View style={style.container}>
            {children}
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default MainLayout;