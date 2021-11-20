import React, { useState } from "react"
import { View, StyleSheet, Text, StyleProp, ViewStyle, TouchableOpacity, Image } from "react-native"
import AppButton from "../../../components/UI/AppButton";
import AppInput from "../../../components/UI/AppInput";
import AppSelect, { SelectItem } from "../../../components/UI/AppSelect/AppSelect";
import Validation, { required } from "../../../components/UI/Validation";
import colors from "../../../constants/colors";
import { ICitizenshipCountry } from "../../../services/PresentationServive";

interface IProps {
    selectedCountry: ICitizenshipCountry | undefined,
    countryes: ICitizenshipCountry[] | undefined;
    onSetCountry: (country: ICitizenshipCountry) => void,
    city: string | undefined,
    onSetCity: (city: string) => void,
    address: string | undefined,
    onSetAddress: (address: string) => void,
    postCode: string | undefined,
    onSetPostCode: (postCode: string) => void,
    onComplate: () => void
}

const ValidationContext = 'userVerification';

const StepOne: React.FC<IProps> = (props) => {
    const [countryErrorStyle, setCountryErrorStyle] = useState<StyleProp<ViewStyle>>({});
    const [countryVisible, setCountryVisible] = useState(false);

    const nextHandler = () => {
        if (!props.selectedCountry) {
            setCountryErrorStyle({ borderColor: colors.danger, borderWidth: 1 });
            return;
        } else {
            setCountryErrorStyle({});
        }

        if (Validation.validate(ValidationContext)) {
            return;
        }

        props.onComplate();
    }

    return (
        <View style={styles.container}>
            <View style={styles.addressContainer}>
                <Text style={styles.BoxTitle}>ჩაეწერეთ იურიდიული მისამართი</Text>
                <View style={[styles.countryBox, countryErrorStyle]}>
                    {props.selectedCountry ?
                        <SelectItem
                            itemKey='countryName'
                            defaultTitle='აირჩიეთ ქვეყანა'
                            item={props.selectedCountry}
                            onItemSelect={() => setCountryVisible(true)}
                            style={styles.countryItem} />
                        :
                        <TouchableOpacity
                            onPress={() => setCountryVisible(true)}
                            style={[styles.countrySelectHandler]}>
                            <Text style={styles.countryPlaceholder}>აირჩიეთ ქვეყანა</Text>
                            <Image style={styles.dropImg} source={require('./../../../assets/images/down-arrow.png')} />
                        </TouchableOpacity>}

                    <AppSelect
                        itemKey='countryName'
                        elements={props.countryes}
                        selectedItem={props.selectedCountry}
                        itemVisible={countryVisible}
                        onSelect={(item) => { props.onSetCountry(item); setCountryVisible(false)}}
                        onToggle={() => setCountryVisible(!countryVisible)} />
                </View>

                <AppInput
                    placeholder='ქალაქი/მუნიციპალიტეტი'
                    onChange={(city) => props.onSetCity(city)}
                    value={props.city}
                    customKey='city'
                    requireds={[required]}
                    style={styles.input}
                    context={ValidationContext} />

                <AppInput
                    placeholder='მისამართი'
                    onChange={(address) => props.onSetAddress(address)}
                    value={props.address}
                    customKey='address'
                    requireds={[required]}
                    style={styles.input}
                    context={ValidationContext} />

                <AppInput
                    placeholder='საფოსტო ინდექსი'
                    onChange={(postCode) => props.onSetPostCode(postCode)}
                    value={props.postCode}
                    customKey='postCode'
                    requireds={[required]}
                    style={styles.input}
                    keyboardType='numeric'
                    context={ValidationContext} />
            </View>
            <AppButton
                title={'შემდეგი'}
                onPress={nextHandler}
                style={styles.button} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 327,
        width: '100%',
        alignSelf: 'center'
    },
    addressContainer: {
        marginTop: 40
    },
    BoxTitle: {
        fontFamily: 'FiraGO-Bold',
        fontSize: 14,
        lineHeight: 17,
        color: colors.labelColor,
        marginBottom: 15
    },
    countryBox: {
        backgroundColor: colors.inputBackGround,
        borderRadius: 7
    },
    countryItem: {
        backgroundColor: colors.inputBackGround,
        borderRadius: 7
    },
    dropImg: {
        marginRight: 12
    },
    countrySelectHandler: {
        height: 54,
        backgroundColor: colors.inputBackGround,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    countryPlaceholder: {
        fontFamily: 'FiraGO-Regular',
        fontSize: 14,
        lineHeight: 17,
        color: colors.placeholderColor,
        marginLeft: 13
    },
    input: {
        marginTop: 20
    },
    button: {
        marginTop: 30
    }
});

export default StepOne;