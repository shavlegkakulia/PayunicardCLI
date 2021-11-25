import React, {useState} from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import Appinput from '../../../components/UI/AppInput';
import AppButton from '../../../components/UI/AppButton';
import colors from '../../../constants/colors';
import Validation, {
  email as _email,
  required,
} from '../../../components/UI/Validation';
import {useSelector} from 'react-redux';
import {tabHeight} from '../../../navigation/TabNav';
import Routes from '../../../navigation/routes';
import { useNavigation } from '@react-navigation/core';

const VALIDATION_CONTEXT = 'signup';

const SignupForm: React.FC = () => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [phone, setPhone] = useState<string | undefined>('');
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const navigation = useNavigation();

  const nextStep = () => {
    if (Validation.validate(VALIDATION_CONTEXT)) {
      return;
    }
    navigation.navigate(Routes.SignupStepTwo, {
      phone,
      name,
      surname,
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
            requireds={[required]}
            customKey="phone"
            context={VALIDATION_CONTEXT}
            style={styles.signupInput}
            value={phone}
            onChange={setPhone}
            keyboardType={'phone-pad'}
            placeholder={'+995 5XX XXX XXX'}
          />

          <Appinput
            requireds={[required]}
            customKey="name"
            context={VALIDATION_CONTEXT}
            style={styles.signupInput}
            value={name}
            onChange={setName}
            placeholder={translate.t('common.name')}
          />

          <Appinput
            requireds={[required]}
            customKey="lname"
            context={VALIDATION_CONTEXT}
            style={styles.signupInput}
            value={surname}
            onChange={setSurname}
            placeholder={translate.t('common.lname')}
          />
        </View>

        <AppButton title={translate.t('common.next')} onPress={nextStep} style={styles.button} />
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
  button: {
    marginBottom: tabHeight + 40
  }
});

export default SignupForm;
