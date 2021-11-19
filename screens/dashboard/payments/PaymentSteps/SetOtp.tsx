import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import FloatingLabelInput from "../../../../containers/otp/Otp";
import colors from "../../../../constants/colors";

interface IProps {
    otp?: string;
    onSetOtp: (otp: string) => void;
    onSendUnicardOTP: () => void;
    style?: StyleProp<ViewStyle>;
}

const SetOtp: React.FC<IProps> = (props) => {
    return (
        <View style={[styles.container, props.style]}>
            <FloatingLabelInput
                    Style={styles.otpBox}
                    label="სმს კოდი"
                    title="სმს კოდი გამოგზავნილია"
                    value={props.otp}
                    onChangeText={props.onSetOtp}
                    onRetry={props.onSendUnicardOTP} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        backgroundColor: colors.white
    },
    otpBox: {
    }
});

export default SetOtp;