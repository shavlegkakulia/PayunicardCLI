import React, {useState} from 'react';
import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import PaginationDots from '../../../../components/PaginationDots';
import AppButton from '../../../../components/UI/AppButton';
import Validation, {
  hasLower,
  hasNumeric,
  hasSpecial,
  hasUpper,
  required,
} from '../../../../components/UI/Validation';
import colors from '../../../../constants/colors';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../../redux/action_types/translate_action_types';
import Appinput, {PasswordValidation} from '../../../../components/UI/AppInput';
import {tabHeight} from '../../../../navigation/TabNav';
import {RouteProp, useRoute} from '@react-navigation/native';
import Routes from '../../../../navigation/routes';
import NavigationService from '../../../../services/NavigationService';

type RouteParamList = {
  params: {
    email: string | undefined;
    backRoute: string | undefined;
    minimizedContent: boolean | undefined;
  };
};

const VALIDATION_CONTEXT = 'PasswordChange5';

const PasswordChangeStepFour: React.FC = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [oldPassword, setOldPassword] = useState<string | undefined>('');
  const [password, setPassword] = useState<string | undefined>('');
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>(
    '',
  );

  const next = () => {
    if (Validation.validate(VALIDATION_CONTEXT)) {
      return;
    }
    NavigationService.navigate(Routes.ChangePasswordOtp, {
      email: route.params.email,
      backRoute: route.params.backRoute,
      minimizedContent: route.params.minimizedContent,
      password,
      oldPassword,
      confirmPassword,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.avoid}>
      <View style={styles.passwordResetContainer}>
        {!route.params.minimizedContent && (
          <>
            <View style={styles.passwordResetHeader}>
              <PaginationDots length={6} step={4} />
            </View>
            <Text style={styles.pwdResettext}>
              {translate.t('login.forgotpassword')}
            </Text>
          </>
        )}
        <View style={styles.inputsContainer}>
          <View style={styles.insertOtpSTep}>
            <Appinput
              requireds={[required, hasLower, hasUpper, hasNumeric, hasSpecial]}
              minLength={8}
              customKey="aldpassword"
              context={VALIDATION_CONTEXT}
              style={styles.formInput}
              value={oldPassword}
              onChange={input => setOldPassword(input)}
              secureTextEntry={true}
              placeholder={translate.t('login.oldPassword')}
            />

            <Appinput
              requireds={[required, hasLower, hasUpper, hasNumeric, hasSpecial]}
              minLength={8}
              customKey="password"
              context={VALIDATION_CONTEXT}
              style={styles.formInput}
              value={password}
              onChange={input => setPassword(input)}
              secureTextEntry={true}
              placeholder={translate.t('login.password')}
            />

            <PasswordValidation value={password || ''} />

            <Appinput
              requireds={[required]}
              customKey="repeatpassword"
              context={VALIDATION_CONTEXT}
              style={styles.formInput}
              value={confirmPassword}
              equalsTo={password}
              onChange={input => setConfirmPassword(input)}
              secureTextEntry={true}
              placeholder={translate.t('login.repeatPassword')}
            />
          </View>
          <AppButton title={translate.t('common.next')} onPress={next} />
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
  pwdResettext: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 24,
    lineHeight: 29,
    color: colors.black,
    marginBottom: 36,
  },
  insertOtpSTep: {
    marginTop: 25,
  },
  formInput: {
    marginBottom: 10,
  },
});

export default PasswordChangeStepFour;
