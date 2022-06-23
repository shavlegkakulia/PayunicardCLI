import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IGetPaymentDetailsResponseData, IService } from "../../../services/PresentationServive";
import PaymentInfo from "./commons/PaymentInfo";

interface IPageProps {
    details: IGetPaymentDetailsResponseData | IService | undefined;
}

const InsertAbonent: React.FC<IPageProps> = (props) => {
    return <View>
        <PaymentInfo details={props.details} />
    </View>
}

export default React.memo(InsertAbonent);

const styles = StyleSheet.create({});