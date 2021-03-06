import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleProp,
  ViewStyle,
  ScrollView,
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
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {formatDate} from '../../../utils/utils';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {tabHeight} from '../../../navigation/TabNav';
import Routes from '../../../navigation/routes';
import {useKeyboard} from '../../../hooks/useKeyboard';
import PresentationServive, {
  ICitizenshipCountry,
} from '../../../services/PresentationServive';
import AppSelect, {
  SelectItem,
} from '../../../components/UI/AppSelect/AppSelect';
import {EN, KA, ka_ge} from '../../../lang';

const geId = 79;

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
  const [birthDate, setBirtDate] = useState<Date | null>(null);
  const [personalId, setPerosnalId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [chooseDate, setChooseDate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryes, setCountries] = useState<
    ICitizenshipCountry[] | undefined
  >();
  const [selectedCountry, setSelectedCountry] = useState<
    ICitizenshipCountry | undefined
  >();
  const [countrySelectVisible, setCountrySelectVisible] = useState(false);
  const [codeErrorStyle, setCodeErrorStyle] = useState<StyleProp<ViewStyle>>(
    {},
  );
  const [dateErrorStyle, setDateErrorStyle] = useState<StyleProp<ViewStyle>>(
    {},
  );
  const navigation = useNavigation();
  const keyboard = useKeyboard();

  const getCitizenshipCountries = () => {
    if (isLoading) return;

    setIsLoading(true);
    PresentationServive.GetCitizenshipCountries().subscribe({
      next: Response => {
        try {
          const res = [...(Response.data.data?.countries || [])];
          const gIndex = res.findIndex(c => c.countryID === geId);
          const filteredCountries =
            gIndex >= 0
              ? [res[gIndex], ...res.filter(c => c.countryID !== geId)]
              : res;
          setCountries(filteredCountries);
        } catch (_) {}
      },
      complete: () => {
        setIsLoading(false);
      },
      error: () => {
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    getCitizenshipCountries();
  }, []);

  const nextStep = () => {
    if (birthDate === null) {
      setDateErrorStyle({
        borderColor: colors.danger,
        borderWidth: 1,
      });
    } else {
      setDateErrorStyle({});
    }

    if (Validation.validate(VALIDATION_CONTEXT) || !birthDate) {
      return;
    }

    if (!selectedCountry?.countryName) {
      setCodeErrorStyle({
        borderColor: colors.danger,
        borderWidth: 1,
      });
      return;
    } else {
      setCodeErrorStyle({});
    }

    navigation.navigate(Routes.SignupStepThree, {
      phone: route.params.phone,
      name: route.params.name,
      surname: route.params.surname,
      birthDate: birthDate.toISOString(),
      personalId,
      userName,
      country: selectedCountry?.countryID,
    });
  };

  const isKeyboardOpen = keyboard.height > 0;

  const dtp = useMemo(
    () => (
      <DatePicker
        modal
        mode="date"
        title={translate.t('common.setDate')}
        cancelText={translate.t('common.cancel')}
        confirmText={translate.t('common.confirm')}
        locale={translate.key === ka_ge ? KA : EN}
        maximumDate={new Date()}
        open={chooseDate}
        date={birthDate || new Date()}
        onDateChange={() => {}}
        onConfirm={date => {
          setChooseDate(false);
          setBirtDate(date);
        }}
        onCancel={() => {
          setChooseDate(false);
        }}
      />
    ),
    [chooseDate],
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.avoid}>
      <ScrollView
      contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.content}>
          <View>
            <Text
              style={[
                styles.signupSignuptext,
                isKeyboardOpen && {marginTop: 0, fontSize: 18},
              ]}>
              {translate.t('signup.startRegister')}
            </Text>
            <TouchableOpacity onPress={() => setChooseDate(true)}>
              <View style={[styles.InputBox, dateErrorStyle]}>
                <Text style={styles.InputBoxTitle}>
                  {translate.t('common.birthDate')}
                </Text>

                <Text style={styles.birthDateValue}>
                  {birthDate ? (
                    formatDate(birthDate?.toString()).split('.').join('/')
                  ) : (
                    <>
                      {translate.t('common.month') +
                        '/' +
                        translate.t('common.day') +
                        '/' +
                        translate.t('common.year')}
                    </>
                  )}
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
              placeholder={translate.t('common.email')}
            />
            <View style={[styles.countryBox]}>
              {selectedCountry?.countryName ? (
                <SelectItem
                  itemKey="countryName"
                  defaultTitle={translate.t('verification.selectCitizenship')}
                  item={selectedCountry}
                  onItemSelect={() => setCountrySelectVisible(true)}
                  style={styles.countryItem}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => setCountrySelectVisible(true)}
                  style={[styles.countrySelectHandler, codeErrorStyle]}>
                  <Text style={styles.countryPlaceholder}>
                    {translate.t('verification.selectCitizenship')}
                  </Text>
                </TouchableOpacity>
              )}
              <AppSelect
                itemKey="countryName"
                elements={countryes}
                selectedItem={selectedCountry}
                itemVisible={countrySelectVisible}
                onSelect={item => {
                  setSelectedCountry(item);
                  setCountrySelectVisible(false);
                }}
                onToggle={() => setCountrySelectVisible(!countrySelectVisible)}
              />
            </View>
          </View>
          <AppButton
            isLoading={isLoading}
            title={translate.t('common.next')}
            onPress={nextStep}
          />
        </View>
      </ScrollView>
      {dtp}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  avoid: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.white,
  },
  scrollView: {
    flexGrow: 1,
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
  countryBox: {
    borderRadius: 7,
    marginBottom: 30,
  },
  countryItem: {
    backgroundColor: '#F6F6F4',
    borderRadius: 7,
    height: 60,
  },
  countrySelectHandler: {
    height: 60,
    backgroundColor: '#F6F6F4',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  countryPlaceholder: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
  },
});

export default SignupStepTwo;
