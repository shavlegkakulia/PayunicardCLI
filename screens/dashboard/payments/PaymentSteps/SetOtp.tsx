import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import FloatingLabelInput from "../../../../containers/otp/Otp";
import colors from "../../../../constants/colors";
import {
    ITranslateState,
    IGlobalState as ITranslateGlobalState,
  }  from "../../../../redux/action_types/translate_action_types";
import { useSelector } from "react-redux";

interface IProps {
    otp?: string;
    onSetOtp: (otp: string) => void;
    onSendUnicardOTP: () => void;
    style?: StyleProp<ViewStyle>;
}

const SetOtp: React.FC<IProps> = (props) => {
    const translate = useSelector<ITranslateGlobalState>(
        state => state.TranslateReduser,
      ) as ITranslateState;
    return (
        <View style={[styles.container, props.style]}>
            <FloatingLabelInput
                    Style={styles.otpBox}
                    label={translate.t('otp.smsCode')}
                    title={translate.t('otp.otpSent')}
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