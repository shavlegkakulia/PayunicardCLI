import React from "react"
import { StyleSheet, Text, View } from "react-native"
import colors from "../../../../constants/colors";

export interface IAmountInfo {
    commision?: number;
    ccy?: string;
    totalAmount?: number;
    minAmount?: number;
    maxAmount?: number;
}

interface IPageProps extends IAmountInfo {}

const AmountInfo: React.FC<IPageProps> = ({ccy, commision, totalAmount, maxAmount, minAmount}) => {
    return <View style={styles.container}>
        <Text style={[styles.item, styles.commision]}>საკომისიო: {commision}{' '}{ccy}</Text>
        <Text style={[styles.item, styles.total]}>სულ გადასახდელი: {totalAmount}{' '}{ccy}</Text>
        <Text style={styles.item}>მინიმალური თანხა: {minAmount}{' '}{ccy}</Text>
        <Text style={styles.item}>მაქსიმალური თანხა: {maxAmount}{' '}{ccy}</Text>
    </View>
}

export default AmountInfo;

const styles = StyleSheet.create({
    container: {

    },
    item: {
        marginBottom: 10,
        fontFamily: 'FiraGO-Regular',
        fontSize: 12,
        lineHeight: 17,
        color: colors.labelColor
    },
    commision: {
        fontFamily: 'FiraGO-Medium',
        fontSize: 14,
        lineHeight: 18,
        color: colors.danger
    },
    total: {
        fontFamily: 'FiraGO-Medium',
        fontSize: 14,
        lineHeight: 18,
        color: colors.black
    }
});