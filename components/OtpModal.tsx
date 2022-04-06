import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import FloatingLabelInput from '../containers/otp/Otp';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../redux/action_types/translate_action_types';
import {useSelector} from 'react-redux';
import {getString} from '../utils/Converter';
import SmsRetriever from 'react-native-sms-retriever';
import AppButton from './UI/AppButton';

interface IProps {
  otp?: string;
  modalVisible: boolean;
  isLoading?: boolean;
  buttonText?: string;
  label?: string;
  resendTitle?: string;
  title?: string;
  onSetOtp: (otp: string) => void;
  onSendOTP?: () => void;
  onClose?: () => void;
  onComplate: () => void;
  style?: StyleProp<ViewStyle>;
}

const OtpModal: React.FC<IProps> = props => {
  const onSmsListener = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        SmsRetriever.addSmsListener(event => {
          if (event) {
          const otp = /(\d{4})/g.exec(getString(event.message))![1];
          props.onSetOtp(otp);
          }
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    onSmsListener();

    return () => SmsRetriever.removeSmsListener();
  }, []);

  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;

  return (
    <Modal
      visible={props.modalVisible}
      onRequestClose={props.onClose}
      animationType="slide">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={styles.otpContent}>
          <FloatingLabelInput
            value={props.otp}
            onChangeText={props.onSetOtp}
            onRetry={props.onSendOTP}
            title={props.title || translate.t('otp.otpSentBlank')}
            resendTitle={props.resendTitle || translate.t('otp.resend')}
            label={props.label || translate.t('otp.smsCode')}
          />
        </View>
        <View style={styles.buttons}>
          <AppButton
            isLoading={props.isLoading}
            onPress={props.onComplate}
            title={props.buttonText || translate.t('common.next')}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  otpContent: {
    flex: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttons: {
    flex: 2,
    paddingHorizontal: 20,
  },
});

export default OtpModal;
