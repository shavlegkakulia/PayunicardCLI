import React, { useState, useCallback } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AppButton from './../../components/UI/AppButton';
import PaginationDots from "./../../components/PaginationDots";
import Colors from './../../constants/colors';

interface IPageProps {
    Complate: () => void;
}

const FirstLoad: React.FC<IPageProps> = (props) => {
    const [step, setStep] = useState(0);
    const fragments = [
        { desc: 'გახსენი საფულე დისტანციურად', imgUrl: require('../../assets/images/load_screen_1.png') },
        { desc: 'მიიღე უფასო არასაბანკო VISA/MASTERCARD ბარათი ', imgUrl: require('../../assets/images/load_screen_2.png') },
        { desc: 'კომუნალურები, სესხები, კონვერტაცია, გზავნილები', imgUrl: require('../../assets/images/load_screen_3.png') },
        { desc: 'დაგროვების და ფასდაკლების ბარათები ერთ აპლიკაციაში', imgUrl: require('../../assets/images/load_screen_4.png') }
    ]
    const nextStep = useCallback(() => {
        setStep(s => {
            if(s === 3) {
                props.Complate();
                return s;
            }
            return s + 1
        });
    }, [step]);
   
    return (
        <View style={styles.screenContainer}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={fragments[step].imgUrl} resizeMode={'cover'} />
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.desc}>{fragments[step].desc}</Text>
                <View style={styles.dotsContainer}>
                    <PaginationDots length={4} step={step} />
                </View>
                <View style={styles.nextButtonView}>
                    <AppButton title="შემდეგი" onPress={nextStep} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'flex-end',
        maxWidth: 327,
        width: '100%',
        alignSelf: 'center',
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
        paddingBottom: 36,
        textAlign: 'center'
    },
    bottomContainer: {
        // maxWidth: 327,
        // width: '100%',
        // alignSelf: 'center',
    },
    dotsContainer: {
        padding: 28,
        width: '100%',
        alignSelf: 'center'
    },
    nextButtonView: {
        width: '100%',
        paddingBottom: 54
    }
})

export default FirstLoad;