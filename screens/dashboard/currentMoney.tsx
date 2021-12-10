import React from 'react';
import { View, StyleSheet, Text, Image, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../../constants/colors';
import { ITranslateState, IGlobalState as ITranslateGlobalState } from '../../redux/action_types/translate_action_types';
import { IGetUserTotalBalanceResponse } from '../../services/UserService';
import { CurrencyConverter, CurrencySimbolConverter } from '../../utils/Converter';

interface IProps {
    totalBalance: IGetUserTotalBalanceResponse | undefined;
    isLoading: boolean;
    containerStyle?: StyleProp<ViewStyle>;
}

const CurrentMoney: React.FC<IProps> = (props) => {
    const translate = useSelector<ITranslateGlobalState>(
        state => state.TranslateReduser,
      ) as ITranslateState;
    const containerStyle = [styles.container, props.containerStyle]
    return (
        <View style={containerStyle}>
            <View style={styles.currentCurrenty}>
                <Text style={styles.currencyTitle}>{translate.t('dashboard.userBalance')}</Text>
                {props.isLoading ?
                    <ActivityIndicator size="small" color={colors.primary} style={styles.loadingBox} /> :
                    <Text style={styles.currencyValue}>{CurrencyConverter(props.totalBalance?.balance)}{CurrencySimbolConverter(props.totalBalance?.ccy)}</Text>}
            </View>

            <View style={styles.currentUniscores}>
                <Text style={styles.currentUniscoresTitle}>{translate.t('dashboard.uniPoints')}</Text>
                {props.isLoading ?
                    <View style={styles.currentUniscoresValueBox}>
                        <ActivityIndicator size="small" color={colors.primary} /></View> :
                    <View style={styles.currentUniscoresValueBox}>
                        <Text style={styles.currentUniscoresValue}>{props.totalBalance?.points}</Text>
                        <Image source={require('../../assets/images/score-star.png')} style={styles.currentUniscoresSimbol} />
                    </View>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    currentCurrenty: {

    },
    currencyTitle: {
        color: colors.labelColor,
        fontFamily: 'FiraGO-Book',
        fontSize: 14,
        lineHeight: 16,
        marginBottom: 3
    },
    currencyValue: {
        color: colors.black,
        fontFamily: 'FiraGO-Bold',
        fontSize: 24,
        lineHeight: 29
    },
    currentUniscores: {

    },
    currentUniscoresTitle: {
        color: colors.labelColor,
        fontFamily: 'FiraGO-Book',
        fontSize: 14,
        lineHeight: 16,
        marginBottom: 3
    },
    currentUniscoresValueBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    currentUniscoresValue: {
        color: colors.black,
        fontFamily: 'FiraGO-Bold',
        fontSize: 24,
        lineHeight: 29
    },
    currentUniscoresSimbol: {
        marginLeft: 5
    },
    loadingBox: {
        alignSelf: 'flex-start',
    }
});

export default CurrentMoney;