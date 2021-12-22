import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
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
import {useNavigation} from '@react-navigation/core';
import {useKeyboard} from '../../../hooks/useKeyboard';
import AppSelect, {
  SelectItem,
} from '../../../components/UI/AppSelect/AppSelect';
import countryCodes from '../../../constants/countryCodes';
import { SafeAreaView } from 'react-navigation';

const VALIDATION_CONTEXT = 'signup';

const SignupForm: React.FC = () => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [phone, setPhone] = useState<string | undefined>('');
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [maxLengt, setMaxLength] = useState<number | undefined>();
  const [code, setCode] = useState<any>({});
  const [codeVisible, setCodeVisible] = useState<boolean>(false);
  const [codeErrorStyle, setCodeErrorStyle] = useState<StyleProp<ViewStyle>>(
    {},
  );
  const navigation = useNavigation();
  const keyboard = useKeyboard();

  const onSetCode = (c: any) => {
    if(c.dial_code === '+995') {
      setMaxLength(9);
      setPhone(undefined);
    } else {
      setMaxLength(undefined);
    }
    
    setCode(c);
  }

  const nextStep = () => {
    if (!code.dial_code) {
      setCodeErrorStyle({
        borderColor: colors.danger,
        borderWidth: 1,
      });
      return;
    } else {
      setCodeErrorStyle({});
    }
    if (Validation.validate(VALIDATION_CONTEXT)) {
      return;
    }
    const PhoneNumber = code + phone;
    navigation.navigate(Routes.SignupStepTwo, {
      phone: PhoneNumber,
      name,
      surname,
    });
  };

  const isKeyboardOpen = keyboard.height > 0;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.avoid}>
        <SafeAreaView style={{flex: 1}}>
      <View style={styles.content}>
        <View>
          <Text
            style={[
              styles.signupSignuptext,
              isKeyboardOpen && {marginTop: 0, fontSize: 18},
            ]}>
            {translate.t('signup.startRegister')}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={[styles.countryBox]}>
              {code.dial_code ? (
                <SelectItem
                  itemKey="dial_code"
                  defaultTitle="+995"
                  item={code}
                  onItemSelect={() => setCodeVisible(true)}
                  style={styles.countryItem}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => setCodeVisible(true)}
                  style={[styles.countrySelectHandler, codeErrorStyle]}>
                  <Text style={styles.countryPlaceholder}>+995</Text>
                </TouchableOpacity>
              )}

              <AppSelect
                itemKey="name"
                elements={countryCodes}
                selectedItem={code}
                itemVisible={codeVisible}
                onSelect={item => {
                  onSetCode(item);
                  setCodeVisible(false);
                }}
                onToggle={() => setCodeVisible(!codeVisible)}
              />
            </View>
            <Appinput
              requireds={[required]}
              customKey="phone"
              context={VALIDATION_CONTEXT}
              style={[styles.signupInput, {marginLeft: 10, flexGrow: 1}]}
              value={phone}
              onChange={setPhone}
              keyboardType={'phone-pad'}
              placeholder={'5XX XXX XXX'}
              maxLength={maxLengt}
            />
          </View>

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

        <AppButton
          title={translate.t('common.next')}
          onPress={nextStep}
          style={styles.button}
        />
      </View>
      </SafeAreaView>
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
  countryBox: {
    borderRadius: 7,
  },
  countryItem: {
    backgroundColor: colors.inputBackGround,
    borderRadius: 7,
    height: 60,
  },
  countrySelectHandler: {
    height: 60,
    backgroundColor: colors.inputBackGround,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  countryPlaceholder: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.dark,
  },
  button: {
    marginBottom: tabHeight + 40,
  },
});

export default SignupForm;
