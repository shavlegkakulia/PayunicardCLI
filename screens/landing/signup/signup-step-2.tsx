import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import Appinput, {autoCapitalize} from '../../../components/UI/AppInput';
import AppButton from '../../../components/UI/AppButton';
import colors from '../../../constants/colors';
import Validation, {
  email as _email,
  required,
} from '../../../components/UI/Validation';
import {useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {formatDate} from '../../../utils/utils';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {tabHeight} from '../../../navigation/TabNav';
import Routes from '../../../navigation/routes';
import { useKeyboard } from '../../../hooks/useKeyboard';

type RouteParamList = {
  params: {
    phone: string;
    name: string;
    surname: string;
  };
};

const VALIDATION_CONTEXT = 'signup2';

const SignupStepTwo: React.FC = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [birthDate, setBirtDate] = useState<Date>(new Date());
  const [personalId, setPerosnalId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [chooseDate, setChooseDate] = useState<boolean>(false);
  const navigation = useNavigation();
  const keyboard = useKeyboard();

  const nextStep = () => {
    if (Validation.validate(VALIDATION_CONTEXT)) {
      return;
    }
    navigation.navigate(Routes.SignupStepThree, {
      phone: route.params.phone,
      name: route.params.name,
      surname: route.params.surname,
      birthDate,
      personalId,
      userName,
    });
  };

  const isKeyboardOpen = keyboard.height > 0;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.avoid}>
      <View style={styles.content}>
        <View>
          <Text style={[styles.signupSignuptext, isKeyboardOpen && {marginTop: 0, fontSize: 18}]}>
            {translate.t('signup.startRegister')}
          </Text>
          <TouchableOpacity onPress={() => setChooseDate(true)}>
            <View style={styles.InputBox}>
              <Text style={styles.InputBoxTitle}>დაბადების თარიღი</Text>

              <Text style={styles.birthDateValue}>
                {formatDate(birthDate?.toString()).split('.').join('/')}
              </Text>
            </View>
          </TouchableOpacity>

          <Appinput
            requireds={[required]}
            customKey="personalnumber"
            context={VALIDATION_CONTEXT}
            style={styles.signupInput}
            value={personalId}
            onChange={setPerosnalId}
            keyboardType={'numeric'}
            maxLength={11}
            placeholder={translate.t('common.personalNumber')}
          />

          <Appinput
            requireds={[_email]}
            customKey="email"
            context={VALIDATION_CONTEXT}
            style={styles.signupInput}
            value={userName}
            onChange={setUserName}
            keyboardType={'email-address'}
            autoCapitalize={autoCapitalize.none}
            placeholder={translate.t('login.email')}
          />
        </View>
        <AppButton title={translate.t('common.next')} onPress={nextStep} />
      </View>

      <DatePicker
        modal
        mode="date"
        title="მიუთითეთ თარიღი"
        cancelText="გაუქმება"
        confirmText="დადასტურება"
        locale="ka-GE"
        open={chooseDate}
        date={birthDate}
        onDateChange={() => {}}
        onConfirm={date => {
          setChooseDate(false);
          setBirtDate(date);
        }}
        onCancel={() => {
          setChooseDate(false);
        }}
      />
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
});

export default SignupStepTwo;
