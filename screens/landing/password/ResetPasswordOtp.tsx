import React, { useState} from 'react';
import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import PaginationDots from '../../../components/PaginationDots';
import AppButton from '../../../components/UI/AppButton';
import colors from '../../../constants/colors';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import NetworkService from '../../../services/NetworkService';
import OTPService, {
  GeneratePhoneOtpByUserRequest,
  ISubmitPhoneOtpByUserRequest,
} from '../../../services/OTPService';
import FloatingLabelInput from '../../../containers/otp/Otp';
import {tabHeight} from '../../../navigation/TabNav';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import Routes from '../../../navigation/routes';

type RouteParamList = {
  params: {
    email: string | undefined;
    phone: string | undefined;
    personalNumber: string | undefined;
    minimizedContent: boolean | undefined
  };
};

const ResetPasswordOtp: React.FC = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [otp, setOtp] = useState<string | undefined>();
  const [otpGuid, setOtpGuid] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const SendPhoneOTP = () => {
    NetworkService.CheckConnection(() => {
      setIsLoading(true);
      let OTP: GeneratePhoneOtpByUserRequest = {
        otpOperationType: '2',
        userName: route.params.email,
      };
      OTPService.GeneratePhoneOtpByUser({OTP}).subscribe({
        next: Response => {
          if (Response.data.ok) {
            setOtp(undefined);
          }
        },
        error: () => {
          setIsLoading(false);
        },
        complete: () => setIsLoading(false),
      });
    });
  };

  const SubmitPhoneOtpByUser = () => {
    NetworkService.CheckConnection(() => {
      let OTP: ISubmitPhoneOtpByUserRequest = {otp: otp, userName: route.params.email};

      OTPService.SubmitPhoneOtpByUser({OTP}).subscribe({
        next: Response => {
          if (Response.data.ok) {
            setOtpGuid(Response.data.data?.otpGuid);
            navigation.navigate(Routes.PasswordResetStepFour, {
              email: route.params.email,
              phone: route.params.phone,
              personalNumber: route.params.personalNumber,
              otpGuid,
              otp,
              minimizedContent: route.params.minimizedContent,
            });
          }
        }
      });
    });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.avoid}>
      <View style={styles.passwordResetContainer}>
        {!route.params.minimizedContent && <><View style={styles.passwordResetHeader}>
          <PaginationDots length={6} step={3} />
        </View></>}
        <View style={styles.inputsContainer}>
          <View style={styles.insertOtpSTep}>
            <Text style={styles.insertOtpCode}>{translate.t('otp.enterOtp')}</Text>
            <FloatingLabelInput
              Style={styles.otpBox}
              label={translate.t('otp.smsCode')}
              title="პაროლის შეცვლისათვის საჭირო სმს კოდი გამოგზავნილია"
              value={otp}
              onChangeText={setOtp}
              onRetry={SendPhoneOTP}
            />
          </View>
          <AppButton
            title={translate.t('common.next')}
            onPress={() => {
              SubmitPhoneOtpByUser();
            }}
            isLoading={isLoading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  avoid: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.white,
  },
  passwordResetContainer: {
    flex: 1,
    padding: 24,
    minHeight: 450,
    paddingBottom: tabHeight + 40,
  },
  passwordResetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 16,
    color: colors.black,
    marginBottom: 34,
    marginTop: 0,
  },
  inputsContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },
  insertOtpSTep: {
    marginTop: 25,
  },
  insertOtpCode: {
    fontFamily: 'FiraGO-Bold',
    fontWeight: '500',
    color: colors.black,
    fontSize: 21,
    lineHeight: 26,
    textAlign: 'left',
  },
  otpBox: {
    marginTop: 40,
  },
});

export default ResetPasswordOtp;
