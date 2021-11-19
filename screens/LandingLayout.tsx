import React from 'react';
import { StyleSheet, View } from 'react-native';


const LandingLayout:React.FC = (props) => {
    return (
        <View style={style.container}>
            {props.children}
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default LandingLayout;