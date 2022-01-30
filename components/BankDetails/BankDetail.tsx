import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../../constants/colors';
import { ITranslateState, IGlobalState as ITranslateGlobalState } from '../../redux/action_types/translate_action_types';
import { IBankTransferDetails } from '../../screens/dashboard/cardsStore/paymentMethods';
const bogImg = require('../../assets/images/BOG-logo.png');


interface IBankDetailProp {
    data: IBankTransferDetails
}

const BankDetail: React.FC<IBankDetailProp> = (props) => {
    const translate = useSelector<ITranslateGlobalState>(
        state => state.TranslateReduser,
      ) as ITranslateState;
    return (
        <View style={style.bankItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Image source={props.data.logoUrl} style={{ width: props.data.id ===3 ? 40 : 30, height: 30, marginRight: 10 }} />
                <Text style={style.titleText}>{props.data.bankName['ka']}</Text>
            </View>
            <View style={style.rowItem}>
                <Text style={style.titleText}>{translate.t('transfer.account')}:</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[style.titleText, {fontFamily: 'FiraGO-Regular'}]}>{props.data.accountNumber}</Text>
                    <Image source={require('../../assets/images/textCopyIcon.png')} style={{width: 12, height: 12}} />
                </View>
                
            </View>
            <View style={style.rowItem}>
                <Text style={style.titleText}>Swift:</Text>
                <Text style={[style.titleText, {fontFamily: 'FiraGO-Regular'}]}>{props.data.swiftCode}</Text>
            </View>
        </View>
    );
};

export default BankDetail;

const style = StyleSheet.create({
    bankItem: {
        borderBottomColor: colors.placeholderColor, 
        borderBottomWidth: 2, 
        paddingBottom: 10, 
        marginBottom: 10
    },

    rowItem: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 5
    },
    
    titleText: {
        fontFamily: 'FiraGO-Bold',
        fontSize: 14,
        lineHeight: 17,
        color: colors.black,
        marginRight: 3,
    }

})