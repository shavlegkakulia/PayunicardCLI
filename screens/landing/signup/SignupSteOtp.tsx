import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import colors from '../../../constants/colors';
import {email as _email} from '../../../components/UI/Validation';
import {useSelector} from 'react-redux';
import {tabHeight} from '../../../navigation/TabNav';
import Routes from '../../../navigation/routes';
import NetworkService from '../../../services/NetworkService';
import OTPService, {
  IOTPServiceRequest,
  ISubmitPhoneOTP,
} from '../../../services/OTPService';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import FloatingLabelInput from '../../../containers/otp/Otp';
import AppButton from '../../../components/UI/AppButton';
import AuthService, {IRegisterRequest} from '../../../services/AuthService';

type RouteParamList = {
  params: {
    phone: string;
    name: string;
    surname: string;
    birthDate: Date;
    personalId: string;
    userName: string;
    password: string;
    confirmPassword: string;
    isApplyTerms: string;
  };
};

const SignupSteOtp: React.FC = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [otpGuid, setOtpGuid] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const SendPhoneOTP = () => {
    NetworkService.CheckConnection(() => {
      let OTP: IOTPServiceRequest = {
        otpOperationType: 1,
        phone: route.params.phone,
      };
      OTPService.SendPhoneOTP({OTP}).subscribe({});
    });
  };

  const SubmitPhoneOTP = () => {
    NetworkService.CheckConnection(() => {
      let OTP: ISubmitPhoneOTP = {otp: otpGuid, phone: route.params.phone};

      OTPService.SubmitPhoneOTP({OTP}).subscribe({
        next: Response => {
          if (Response.data.ok) {
            registerUser(Response.data.data.otpGuid);
          }
        },
      });
    });
  };

  const registerUser = (otp: string) => {
    NetworkService.CheckConnection(() => {
      setIsLoading(true);
      let User: IRegisterRequest = {
        phone: route.params.phone,
        name: route.params.name,
        surname: route.params.surname,
        birthDate: route.params.birthDate.toLocaleDateString(),
        personalId: route.params.personalId,
        userName: route.params.userName,
        password: route.params.password,
        confirmPassword: route.params.confirmPassword,
        isApplyTerms: route.params.isApplyTerms,
        otpGuid: otp,
      };
      AuthService.SignUp({User}).subscribe({
        next: Response => {
          if (Response.data.ok) {
            navigation.navigate(Routes.Landing);
          }
        },
        error: () => {
          setIsLoading(false);
        },
        complete: () => {
          setIsLoading(false);
        },
      });
    });
  };

  const nextStep = () => {
    SubmitPhoneOTP();
  };

  useEffect(() => {
    SendPhoneOTP();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.avoid}>
      <View style={styles.content}>
        <View>
          <View style={styles.insertOtpSTep}>
            <Text style={styles.insertOtpCode}>შეიყვანე სმს კოდი</Text>
            <FloatingLabelInput
              Style={styles.otpBox}
              label="სმს კოდი"
              title="ავტორიზაციისთვის საჭირო სმს კოდი გამოგზავნილია"
              value={otpGuid}
              onChangeText={setOtpGuid}
              onRetry={SendPhoneOTP}
            />
          </View>
        </View>
        <AppButton
          title={translate.t('common.next')}
          onPress={nextStep}
          isLoading={isLoading}
        />
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
  content: {
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: tabHeight + 40,
  },
  insertOtpSTep: {
    marginTop: 25,
  },
  insertOtpCode: {
    fontFamily: 'FiraGO-Bold',
    fontWeight: '500',
    color: colors.black,
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'left',
  },
  otpBox: {
    marginTop: 40,
  },
});

export default SignupSteOtp;
