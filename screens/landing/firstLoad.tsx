import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AppButton from './../../components/UI/AppButton';
import PaginationDots from "./../../components/PaginationDots";
import Colors from './../../constants/colors';

const FirstLoad = () => {
    return (
        <View style={styles.screenContainer}>
            <View style={styles.imageContainer}>
                <Image style={{ width: '100%' }} source={require('../../assets/images/load_screen_1.png')} resizeMode={'cover'} />
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.desc}>გახსენი საფულე დისტანციურად</Text>
                <View style={{padding: 28, width: '100%', alignSelf: 'center'}}>
                    <PaginationDots length={4} />
                </View>
                <View style={styles.nextButtonView}>
                    <AppButton title="შემდეგი" size="sm" onPress={() => { }} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'flex-end'
    },
    image: {
        width: '100%'
    },
    imageContainer: {
        paddingBottom: 116
    },
    desc: {
        fontSize: 23,
        color: Colors.black,
        alignSelf: "center",
        fontFamily: 'FiraGO-Bold',
        paddingBottom: 50
    },
    bottomContainer: {
        maxWidth: 327,
        width: '100%',
        alignSelf: 'center',
    },
    nextButtonView: {
        width: '100%',
        paddingBottom: 54
    }
})

export default FirstLoad;