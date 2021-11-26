import {RouteProp, useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useSelector} from 'react-redux';
import AppButton from '../../../components/UI/AppButton';
import AppInput from '../../../components/UI/AppInput';
import AppSelect, {
  SelectItem,
} from '../../../components/UI/AppSelect/AppSelect';
import Validation, {required} from '../../../components/UI/Validation';
import colors from '../../../constants/colors';
import userStatuses from '../../../constants/userStatuses';
import {useKeyboard} from '../../../hooks/useKeyboard';
import Routes from '../../../navigation/routes';
import { tabHeight } from '../../../navigation/TabNav';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import NavigationService from '../../../services/NavigationService';
import {ICitizenshipCountry} from '../../../services/PresentationServive';
import UserService, {IStatus, IType2} from '../../../services/UserService';
import StepsContent from './StepContent';

type RouteParamList = {
  params: {
    countryes: ICitizenshipCountry[] | undefined;
  };
};

const VALIDATION_CONTEXT = 'Verification1';

const verificationStepCount = 9;

const StepOne: React.FC = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [country, setCountry] = useState<ICitizenshipCountry>();
  const [city, setCity] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [postCode, setPostCode] = useState<string>();

  const [employmentStatuses, setEmploymentStatuses] = useState<
    IStatus[] | undefined
  >();
  const [customerWorkTypes, setCustomerWorkTypes] = useState<
    IType2[] | undefined
  >();

  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;

  const [countryErrorStyle, setCountryErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [countryVisible, setCountryVisible] = useState(false);

  const stepTwoScreenAction = () => {
    if (!country) {
      setCountryErrorStyle({borderColor: colors.danger, borderWidth: 1});
      return;
    } else {
      setCountryErrorStyle({});
    }

    if (Validation.validate(VALIDATION_CONTEXT)) {
      return;
    }

    getCustomerEmploymentStatusTypes();
    getCustomerWorkTypes();
  };

  const getCustomerEmploymentStatusTypes = () => {
    setIsLoading(true);
    UserService.GetCustomerEmploymentStatusTypes().subscribe({
      next: Response => {
        setEmploymentStatuses(Response.data.data?.statuses);
      },
      complete: () => setIsLoading(false),
      error: () => {
        setIsLoading(false);
      },
    });
  };

  const getCustomerWorkTypes = () => {

    setIsLoading(true);
    UserService.GetCustomerWorkTypes().subscribe({
      next: Response => {
        setCustomerWorkTypes(Response.data.data?.types);
      },
      complete: () => setIsLoading(false),
      error: () => {
        setIsLoading(false);
      },
    });
  };

  const {documentVerificationStatusCode} = userData.userDetails || {};

  useEffect(() => {
    if (
      documentVerificationStatusCode === userStatuses.Enum_PartiallyProcessed
    ) {
      //setVerificationStep(VERIFICATION_STEPS.step_four);
    }
  }, [documentVerificationStatusCode]);

  useEffect(() => {
    if (employmentStatuses && customerWorkTypes) {
      NavigationService.navigate(Routes.verificationStepTwo, {
        country,
        city,
        address, 
        postCode,
        employmentStatuses,
        customerWorkTypes
      });
      return;
    }
  }, [employmentStatuses, customerWorkTypes]);


  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View>
          <StepsContent
            currentStep={1}
            stepArray={Array.from(Array(verificationStepCount).keys())}
          />
          <View>
            <View style={styles.container}>
              <View style={styles.addressContainer}>
                <Text style={styles.BoxTitle}>
                  ჩაეწერეთ იურიდიული მისამართი
                </Text>
                <View style={[styles.countryBox, countryErrorStyle]}>
                  {country ? (
                    <SelectItem
                      itemKey="countryName"
                      defaultTitle="აირჩიეთ ქვეყანა"
                      item={country}
                      onItemSelect={() => setCountryVisible(true)}
                      style={styles.countryItem}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => setCountryVisible(true)}
                      style={[styles.countrySelectHandler]}>
                      <Text style={styles.countryPlaceholder}>
                        აირჩიეთ ქვეყანა
                      </Text>
                      <Image
                        style={styles.dropImg}
                        source={require('./../../../assets/images/down-arrow.png')}
                      />
                    </TouchableOpacity>
                  )}

                  <AppSelect
                    itemKey="countryName"
                    elements={route.params.countryes}
                    selectedItem={country}
                    itemVisible={countryVisible}
                    onSelect={item => {
                      setCountry(item);
                      setCountryVisible(false);
                    }}
                    onToggle={() => setCountryVisible(!countryVisible)}
                  />
                </View>

                <AppInput
                  placeholder="ქალაქი/მუნიციპალიტეტი"
                  onChange={city => setCity(city)}
                  value={city}
                  customKey="city"
                  requireds={[required]}
                  style={styles.input}
                  context={VALIDATION_CONTEXT}
                />

                <AppInput
                  placeholder="მისამართი"
                  onChange={address => setAddress(address)}
                  value={address}
                  customKey="address"
                  requireds={[required]}
                  style={styles.input}
                  context={VALIDATION_CONTEXT}
                />

                <AppInput
                  placeholder="საფოსტო ინდექსი"
                  onChange={postCode => setPostCode(postCode)}
                  value={postCode}
                  customKey="postCode"
                  requireds={[required]}
                  style={styles.input}
                  keyboardType="numeric"
                  context={VALIDATION_CONTEXT}
                />
              </View>
             
            </View>
          </View>
          </View>

          <AppButton
                title={'შემდეგი'}
                onPress={stepTwoScreenAction}
                style={styles.button}
                isLoading={isLoading}
              />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexGrow: 1,
    paddingHorizontal: 20
  },
  content: {
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: tabHeight + 40
  },
  addressContainer: {
    marginTop: 40,
  },
  BoxTitle: {
    fontFamily: 'FiraGO-Bold',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    marginBottom: 15,
  },
  countryBox: {
    backgroundColor: colors.inputBackGround,
    borderRadius: 7,
  },
  countryItem: {
    backgroundColor: colors.inputBackGround,
    borderRadius: 7,
  },
  dropImg: {
    marginRight: 12,
  },
  countrySelectHandler: {
    height: 54,
    backgroundColor: colors.inputBackGround,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryPlaceholder: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.placeholderColor,
    marginLeft: 13,
  },
  input: {
    marginTop: 20,
  },
  button: {
    marginTop: 30,
  },
});

export default StepOne;
