import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { IGetPaymentDetailsResponseData, IService } from "../../../../services/PresentationServive";

interface IPageProps {
    details: IService | undefined;
}

const PaymentInfo: React.FC<IPageProps> = (props) => {
    const {name, merchantServiceURL} = props.details || {}
    console.log(props.details)
    return <View style={{flexDirection: 'row'}}>
        <Image source={{uri: merchantServiceURL}} style={{width: 30, height: 30}} />
        <Text>{name}</Text>
        </View>
}

export default PaymentInfo;

const styles = StyleSheet.create({});