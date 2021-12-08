import React, {useState} from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import Appinput, {PasswordValidation} from '../../../components/UI/AppInput';
import AppButton from '../../../components/UI/AppButton';
import colors from '../../../constants/colors';
import Validation, {
  checked,
  email as _email,
  hasLower,
  hasNumeric,
  hasSpecial,
  hasUpper,
  required,
} from '../../../components/UI/Validation';
import {useSelector} from 'react-redux';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {tabHeight} from '../../../navigation/TabNav';
import Routes from '../../../navigation/routes';
import AppCheckbox from '../../../components/UI/AppCheckbox';

type RouteParamList = {
  params: {
    phone: string;
    name: string;
    surname: string;
    birthDate: Date;
    personalId: string;
    userName: string;
  };
};

const VALIDATION_CONTEXT = 'signup3';

const SignupStepThree: React.FC = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isApplyTerms, setIsApplyTerms] = useState<number>(0);
  const navigation = useNavigation();

  const setAgreement = (value: boolean) => {
    setIsApplyTerms(value ? 1 : 0);
  };

  const nextStep = () => {
    if (Validation.validate(VALIDATION_CONTEXT)) {
      return;
    }
    navigation.navigate(Routes.SignupSteOtp, {
      phone: route.params.phone,
      name: route.params.name,
      surname: route.params.surname,
      birthDate: route.params.birthDate,
      personalId: route.params.personalId,
      userName: route.params.userName,
      password,
      confirmPassword,
      isApplyTerms,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.avoid}>
      <View style={styles.content}>
        <View>
          <Text style={styles.signupSignuptext}>
            {translate.t('signup.startRegister')}
          </Text>
          <Appinput
            requireds={[required, hasLower, hasUpper, hasNumeric, hasSpecial]}
            minLength={8}
            customKey="password"
            context={VALIDATION_CONTEXT}
            style={styles.formInputs}
            value={password}
            onChange={input => setPassword(input)}
            secureTextEntry={true}
            placeholder={translate.t('login.password')}
          />

          <PasswordValidation value={password} />

          <Appinput
            requireds={[required]}
            customKey="repeatpassword"
            context={VALIDATION_CONTEXT}
            style={styles.formInputs}
            value={confirmPassword}
            equalsTo={password}
            onChange={input => setConfirmPassword(input)}
            secureTextEntry={true}
            placeholder={translate.t('login.repeatPassword')}
          />

          <AppCheckbox
            customKey="agree"
            requireds={[checked]}
            context={VALIDATION_CONTEXT}
            value={isApplyTerms != 0}
            style={styles.termCheckBox}
            activeColor={colors.primary}
            label={translate.t('common.agreeTerms')}
            clicked={setAgreement}
          />
        </View>
        <AppButton title={translate.t('common.next')} onPress={nextStep} />
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
  signupSignuptext: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 24,
    lineHeight: 29,
    color: colors.black,
    marginVertical: 36,
  },
  signupInput: {
    backgroundColor: '#F6F6F4',
    marginBottom: 16,
  },
  InputBox: {
    backgroundColor: colors.inputBackGround,
    borderRadius: 7,
    height: 59,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  InputBoxTitle: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
  },
  birthDateValue: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    marginTop: 5,
  },
  formInputs: {
    marginBottom: 10,
  },
  termCheckBox: {
    alignSelf: 'flex-start',
    marginBottom: 47,
  },
});

export default SignupStepThree;
