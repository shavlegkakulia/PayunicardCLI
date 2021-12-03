import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import userStatuses from '../../../constants/userStatuses';
import {useDimension} from '../../../hooks/useDimension';
import {useKeyboard} from '../../../hooks/useKeyboard';
import Routes from '../../../navigation/routes';
import { tabHeight } from '../../../navigation/TabNav';
import {FetchUserDetail} from '../../../redux/actions/user_actions';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import KvalificaServices, {
  getKycFullYear,
  IKCData,
} from '../../../services/KvalificaServices';
import NavigationService from '../../../services/NavigationService';
import NetworkService from '../../../services/NetworkService';
import PresentationServive, {
  ICitizenshipCountry,
} from '../../../services/PresentationServive';
import UserService, {
  ICustomerRegistrationNewRequest,
  IExpectedType,
  IFinishCustomerRegistrationRequest,
  IStatus,
  IType2,
} from '../../../services/UserService';
import {getString} from '../../../utils/Converter';
import KvalifcaVerification from '../KvalifcaVerification';
import Finish from './Finish';
import StepEight from './StepEight';
import StepFour from './StepFour';
import StepNine from './StepNine';
import StepOne from './StepOne';
import StepSeven from './StepSeven';
import StepSix from './StepSix';
import StepThree from './StepThree';
import StepTwo from './StepTwo';
import Welcome from './Welcome';

const VERIFICATION_STEPS = {
  welcome: 0,
  step_one: 1,
  step_two: 2,
  step_three: 3,
  step_four: 4,
  step_five: 5,
  step_six: 6,
  step_seven: 7,
  step_eight: 8,
  step_nine: 9,
  step_ten: 10,
};

const STEP_TITLES = [
  'იდენტიფიკაცია',
  'დამატებითი მონაცემები',
  'დამატებითი მონაცემები',
  'დამატებითი მონაცემები',
  'დამატებითი მონაცემები',
  '',
  'დამატებითი მონაცემები',
  'დამატებითი მონაცემები',
  'ვერიფიკაცია',
  'ვერიფიკაცია',
];

export interface ITransactionCategoryInterface {
  id: number;
  value: string;
  active: boolean;
}

const TransactionCategories: ITransactionCategoryInterface[] = [
  {id: 1, value: 'კომუნალური და კომუნიკაციები', active: false},
  {id: 2, value: 'ტრანსპორტი', active: false},
  {id: 3, value: 'საერთაშორისო ტრანზაქციები', active: false},
  {id: 4, value: 'ტოტალიზატორი, აზარტული ონლაინ თამაშები', active: false},
  {id: 5, value: 'სხვა', active: false},
];

interface IStepsProps {
  currentStep: number;
}

const verificationStepCount = 9;

const StepsContent: React.FC<IStepsProps> = props => {
  return (
    <View style={styles.stepContainer}>
      {Array.from(Array(verificationStepCount).keys()).map((_, index) => (
        <View
          key={index}
          style={[
            styles.step,
            index <= props.currentStep - 1 && styles.activeStep,
          ]}>
          <Text
            style={[
              styles.stepText,
              index <= props.currentStep - 1 && styles.activeStepText,
            ]}>
            {index + 1}
          </Text>
        </View>
      ))}
    </View>
  );
};

const Verification: React.FC = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<number>(
    VERIFICATION_STEPS.welcome,
  );
  const [title, setTtile] = useState<string>(STEP_TITLES[verificationStep]);
  const [countryes, setCountries] = useState<
    ICitizenshipCountry[] | undefined
  >();
  const [country, setCountry] = useState<ICitizenshipCountry>();
  const [country2, setCountry2] = useState<ICitizenshipCountry | undefined>();
  const [city, setCity] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [postCode, setPostCode] = useState<string>();

  const [selectedEmploymentStatus, setSlectedEmploymentStatus] =
    useState<IStatus>();
  const [employmentStatuses, setEmploymentStatuses] = useState<
    IStatus[] | undefined
  >();
  const [customerWorkTypes, setCustomerWorkTypes] = useState<
    IType2[] | undefined
  >();
  const [selectedJobType, setSelectedJobType] = useState<IType2>();
  const [complimentary, setComplimentary] = useState<string>();
  const [occupiedPosition, setOccupiedPosition] = useState<string>();

  const [customerExpectedTurnoverTypes, setCustomerExpectedTurnoverTypes] =
    useState<IExpectedType[] | undefined>();
  const [customerExpectedTurnoverType, setCustomerExpectedTurnoverType] =
    useState<IExpectedType | undefined>();

  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategoryInterface[]
  >(TransactionCategories);
  const [anotherTransactionCategory, setAnotherTransactionCategory] =
    useState<string>();
  const [startVerification, setStartVerification] = useState<boolean>(false);
  const [userKYCData, setUserKYCData] = useState<IKCData | undefined>();
  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const dispatch = useDispatch();
  const keyboard = useKeyboard();

  const onToggletransactionCategoryActive = (
    category: ITransactionCategoryInterface,
  ) => {
    let _categoryes = [...transactionCategories];
    let categoryIndex = _categoryes.findIndex(
      transact => transact.value === category.value,
    );
    if (categoryIndex >= 0) {
      _categoryes[categoryIndex].active = !_categoryes[categoryIndex].active;
      setTransactionCategories(_ => [..._categoryes]);
    }
  };

  const resetState = () => {
    //setVerificationStep(VERIFICATION_STEPS.welcome);
    setTtile(STEP_TITLES[verificationStep]);
  };

  const welcomeScreenAction = (action: number) => {
    if (action === 0) {
      getCitizenshipCountries();
    }
  };

  const stepTwoScreenAction = () => {
    if (employmentStatuses && customerWorkTypes) {
      setVerificationStep(VERIFICATION_STEPS.step_two);
      return;
    }
    getCustomerEmploymentStatusTypes();
    getCustomerWorkTypes();
  };

  const stepThreeScreenAction = () => {
    getCustomerExpectedTurnoverTypes();
  };

  const onStartVerification = () => {
    setStartVerification(true);
  };

  const getCitizenshipCountries = () => {
    if (isLoading) return;

    setIsLoading(true);
    PresentationServive.GetCitizenshipCountries().subscribe({
      next: Response => {
        setCountries(Response.data.data?.countries);
      },
      complete: () => {
        setIsLoading(false);
        setVerificationStep(VERIFICATION_STEPS.step_one);
      },
      error: () => {
        setIsLoading(false);
      },
    });
  };

  const getCustomerEmploymentStatusTypes = () => {
    UserService.GetCustomerEmploymentStatusTypes().subscribe({
      next: Response => {
        setEmploymentStatuses(Response.data.data?.statuses);
      },
      error: () => {
        setIsLoading(false);
      },
    });
  };

  const getCustomerWorkTypes = () => {
    if (isLoading) return;

    setIsLoading(true);
    UserService.GetCustomerWorkTypes().subscribe({
      next: Response => {
        setCustomerWorkTypes(Response.data.data?.types);
      },
      error: () => {
        setIsLoading(false);
      },
    });
  };

  const getCustomerExpectedTurnoverTypes = () => {
    if (isLoading) return;

    if (customerExpectedTurnoverTypes) {
      setVerificationStep(VERIFICATION_STEPS.step_three);
      return;
    }

    setIsLoading(true);
    UserService.GetCustomerExpectedTurnoverTypes().subscribe({
      next: Response => {
        setCustomerExpectedTurnoverTypes(Response.data.data?.types);
      },
      complete: () => {
        setIsLoading(false);
        setVerificationStep(VERIFICATION_STEPS.step_three);
      },
      error: () => {
        setIsLoading(false);
      },
    });
  };

  const closeKvalificaVerification = () => {
    setStartVerification(false);
    setVerificationStep(VERIFICATION_STEPS.step_seven);
  };

  const checkKycSession = () => {
    setIsLoading(true);
    KvalificaServices.CheckKycSession().subscribe({
      next: Response => {
        if (Response.data.ok) {
          if (Response.data.data?.skipKycSession) {
            getKycSessionData();
          } else {
            setVerificationStep(VERIFICATION_STEPS.step_five);
          }
        }
      },
      complete: () => {
        setIsLoading(false);
      },
      error: () => {
        setIsLoading(false);
        complate();
      },
    });
  };

  const parseAndSetKCdata = (data: IKCData | undefined) => {
    const {
      birthDate,
      countryID,
      documentBackSide,
      documentFrontSide,
      documentNumber,
      documetType,
      firstName,
      lastName,
      personalNumber,
      selfImages,
      sex,
    } = data || {};

    setUserKYCData({
      customerSelfContent: 'Selfie',
      customerSelfName: selfImages?.[0].split('/')[4],
      customerSelf: selfImages?.[0],
      documetType: documetType,
      documentBackSideContent: 'Back',
      documentBackSide: documentBackSide,
      documentBackSideName: documentBackSide?.split('/')[4],
      documentFrontSideContent: 'Front',
      documentFrontSide: documentFrontSide,
      documentFrontSideName: documentFrontSide?.split('/')[4],
      firstName,
      lastName,
      birthCityId: 0,
      countryID,
      sex: sex,
      birthDate: getKycFullYear(getString(birthDate)),
      personalNumber,
      documentNumber,
    });
  };

  const getKycSessionData = () => {
    KvalificaServices.GetKycSessionData().subscribe({
      next: Response => {
        parseAndSetKCdata(Response.data?.data?.data?.[0]);
      },
      complete: () => {
        setVerificationStep(VERIFICATION_STEPS.step_six);
      },
    });
  };

  const closeKycSession = (sessionId: string | undefined) => {
    if (!sessionId) {
      closeKvalificaVerification();
      return;
    }
    KvalificaServices.CloseKycSession(sessionId).subscribe({
      next: Response => {
        parseAndSetKCdata(Response.data?.data);
      },
      complete: () => {
        closeKvalificaVerification();
      },
    });
  };

  const onCustomerRegistration = () => {
    const data: ICustomerRegistrationNewRequest = {
      isResident: country?.countryID == 79 ? true : false,
      factCountryID: country?.countryID,
      factCity: city,
      factCityID: 0,
      factAddress: address,
      factPostalCode: postCode,
      legalCountryID: country?.countryID,
      legalCity: city,
      legalCityID: 0,
      legalAddress: address,
      legalPostalCode: postCode,
      employmentStatusCode: selectedEmploymentStatus?.employmentStatusCode,
      employmentTypeCode: selectedEmploymentStatus?.employmentStatus,
      employer: complimentary,
      workPosition: occupiedPosition,
      expectedTurnoverCode: customerExpectedTurnoverType?.expectedTurnoverCode,
      hasUtility: transactionCategories.filter(c => c.id === 1)[0].active,
      hasTransport: transactionCategories.filter(c => c.id === 2)[0].active,
      hasTelecomunication: false,
      hasInternatiolalTransactions: transactionCategories.filter(
        c => c.id === 3,
      )[0].active,
      hasGambling: transactionCategories.filter(c => c.id === 4)[0].active,
      hasOther: transactionCategories.filter(c => c.id === 5)[0].active,
      otherDesctiption: anotherTransactionCategory,
      termID: 1,
    };
    UserService.CustomerRegistration(data).subscribe({
      next: Response => {
        if (Response.data.ok) {
          setVerificationStep(VERIFICATION_STEPS.step_four);
        }
      },
      complete: () => {
        setCountry(undefined);
        setCity(undefined);
        setAddress(undefined);
        setPostCode(undefined);
        setEmploymentStatuses(undefined);
        setSelectedJobType(undefined);
        setComplimentary(undefined);
        setOccupiedPosition(undefined);
        setCustomerExpectedTurnoverType(undefined);
        setAnotherTransactionCategory(undefined);
      },
      error: err => {},
    });
  };

  const onFinishCostumerRegistration = () => {
    let data: IFinishCustomerRegistrationRequest = {
      customerSelfContent: userKYCData?.customerSelfContent,
      customerSelfName: userKYCData?.customerSelfName,
      customerSelf: userKYCData?.customerSelf,
      documentType:
        userKYCData?.documetType === 'ID' ? 'Enum_IDCard' : 'Enum_Passport',
      documentBackSideContent: userKYCData?.documentBackSideContent,
      documentBackSide: userKYCData?.documentBackSide,
      documentBackSideName: userKYCData?.documentBackSideName,
      documentFrontSideContent: userKYCData?.documentFrontSideContent,
      documentFrontSide: userKYCData?.documentFrontSide,
      documentFrontSideName: userKYCData?.documentFrontSideName,
      birthDate: `${userKYCData?.birthDate}-01-01`,
      name: userKYCData?.firstName,
      surname: userKYCData?.lastName,
      birthCityId: 0,
      citizenshipCountryID: country?.countryID,
      secondaryCitizenshipCountryID: country2?.countryID || undefined,
    };

    if (userKYCData?.documetType === 'ID') {
      data = {...data, personalID: userKYCData.personalNumber};
    } else {
      data = {...data, passportNumber: userKYCData?.documentNumber};
    }

    UserService.FinishCostumerRegistration(data).subscribe({
      next: Response => {
        if (Response.data.ok) {
          setVerificationStep(VERIFICATION_STEPS.step_nine);
        }
      },
      error: () => {},
    });
  };

  const Back = () => {
    Keyboard.dismiss();
    setVerificationStep(step => (step = step - 1));
  };

  useEffect(() => {
    if (employmentStatuses && customerWorkTypes) {
      setIsLoading(false);
      setVerificationStep(VERIFICATION_STEPS.step_two);
    }
  }, [employmentStatuses, customerWorkTypes]);

  useEffect(() => {
    setTtile(STEP_TITLES[verificationStep]);
  }, [verificationStep]);

  const complate = () => {
    NetworkService.CheckConnection(() => {
      dispatch(FetchUserDetail());
    });
    NavigationService.navigate(Routes.Dashboard);
  };

  const {documentVerificationStatusCode} = userData.userDetails || {};

  useEffect(() => {
    if (
      documentVerificationStatusCode === userStatuses.Enum_PartiallyProcessed &&
      verificationStep > VERIFICATION_STEPS.welcome &&
      verificationStep < VERIFICATION_STEPS.step_four
    ) {
      setVerificationStep(VERIFICATION_STEPS.step_four);
    }
  }, [documentVerificationStatusCode, verificationStep]);

  const dimension = useDimension();
  let isKeyboardVisible = keyboard.height > 0;
  let content: JSX.Element = (
    <Welcome onActionClick={welcomeScreenAction} loading={isLoading} />
  );
  if (verificationStep === VERIFICATION_STEPS.step_one) {
    content = (
      <StepOne
        countryes={countryes}
        selectedCountry={country}
        onSetCountry={setCountry}
        city={city}
        onSetCity={setCity}
        address={address}
        onSetAddress={setAddress}
        postCode={postCode}
        onSetPostCode={setPostCode}
        onComplate={stepTwoScreenAction}
      />
    );
  } else if (verificationStep === VERIFICATION_STEPS.step_two) {
    content = (
      <StepTwo
        loading={isLoading}
        employmentStatuses={employmentStatuses}
        customerWorkTypes={customerWorkTypes}
        onSetEmploymentStatus={setSlectedEmploymentStatus}
        selectedEmploymentStatus={selectedEmploymentStatus}
        selectedJobType={selectedJobType}
        onSetJobTypes={setSelectedJobType}
        occupiedPosition={occupiedPosition}
        onSetOccupiedPositios={setOccupiedPosition}
        onSetComplimentary={setComplimentary}
        complimentary={complimentary}
        onComplate={stepThreeScreenAction}
      />
    );
  } else if (verificationStep === VERIFICATION_STEPS.step_three) {
    content = (
      <StepThree
        loading={isLoading}
        setAnotherTransactionCategory={setAnotherTransactionCategory}
        anotherTransactionCategory={anotherTransactionCategory}
        transactionCategories={transactionCategories}
        expectedTurnovers={customerExpectedTurnoverTypes}
        onToggleTransactionCategory={onToggletransactionCategoryActive}
        selectedExpectedTurnover={customerExpectedTurnoverType}
        onSetExpectedTurnover={setCustomerExpectedTurnoverType}
        onComplate={() => onCustomerRegistration()}
      />
    );
  } else if (verificationStep === VERIFICATION_STEPS.step_four) {
    content = (
      <StepFour loading={isLoading} onComplate={() => checkKycSession()} />
    );
  } else if (verificationStep === VERIFICATION_STEPS.step_five) {
    content = <StepSix loading={isLoading} onComplate={onStartVerification} />;
  } else if (verificationStep === VERIFICATION_STEPS.step_six) {
    content = (
      <StepSeven
        kycData={userKYCData}
        onUpdateData={setUserKYCData}
        onComplate={() => setVerificationStep(VERIFICATION_STEPS.step_seven)}
      />
    );
  } else if (verificationStep === VERIFICATION_STEPS.step_seven) {
    content = (
      <StepEight
        countryes={countryes}
        selectedCountry={country}
        onSetCountry={setCountry}
        selectedCountry2={country2}
        onSetCountry2={setCountry2}
        kycData={userKYCData}
        onUpdateData={setUserKYCData}
        onComplate={() => setVerificationStep(VERIFICATION_STEPS.step_eight)}
      />
    );
  } else if (verificationStep === VERIFICATION_STEPS.step_eight) {
    content = (
      <StepNine
        loading={isLoading}
        onComplate={() => onFinishCostumerRegistration()}
        kycData={userKYCData}
      />
    );
  } else if (verificationStep === VERIFICATION_STEPS.step_nine) {
    content = <Finish loading={isLoading} onComplate={complate} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.avoid}>
      <KeyboardAvoidingView behavior="padding" style={styles.avoid}>
        <KvalifcaVerification
          startSession={startVerification}
          onClose={closeKycSession}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
          <View style={{flex: 1}}>
            {verificationStep > VERIFICATION_STEPS.welcome &&
              verificationStep !== VERIFICATION_STEPS.step_four &&
              verificationStep !== VERIFICATION_STEPS.step_five &&
              verificationStep !== VERIFICATION_STEPS.step_six &&
              verificationStep !== VERIFICATION_STEPS.step_seven &&
              verificationStep !== VERIFICATION_STEPS.step_eight &&
              verificationStep !== VERIFICATION_STEPS.step_nine && (
                <StepsContent currentStep={verificationStep} />
              )}
 <View style={styles.header}>
        {verificationStep !== VERIFICATION_STEPS.step_four &&
          verificationStep !== VERIFICATION_STEPS.step_five && (
            <View
              style={[
                styles.paymentStepHeaderHeader,
                (verificationStep === VERIFICATION_STEPS.welcome ||
                  verificationStep === VERIFICATION_STEPS.step_six ||
                  verificationStep === VERIFICATION_STEPS.step_seven ||
                  verificationStep === VERIFICATION_STEPS.step_eight ||
                  verificationStep === VERIFICATION_STEPS.step_nine) && {
                  justifyContent: 'center',
                },
              ]}>
              {verificationStep > VERIFICATION_STEPS.welcome &&
                verificationStep !== VERIFICATION_STEPS.step_six &&
                verificationStep !== VERIFICATION_STEPS.step_seven &&
                verificationStep !== VERIFICATION_STEPS.step_eight &&
                verificationStep !== VERIFICATION_STEPS.step_nine && (
                  <TouchableOpacity style={styles.back} onPress={Back}>
                    <Image
                      style={styles.backImg}
                      source={require('./../../../assets/images/back-arrow-primary.png')}
                    />
                    <Text style={styles.backText}>
                      {translate.t('common.back')}
                    </Text>
                  </TouchableOpacity>
                )}

              <View style={styles.titleBox}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.titleText,
                    (verificationStep === VERIFICATION_STEPS.welcome ||
                      verificationStep === VERIFICATION_STEPS.step_six ||
                      verificationStep === VERIFICATION_STEPS.step_seven ||
                      verificationStep === VERIFICATION_STEPS.step_eight ||
                      verificationStep === VERIFICATION_STEPS.step_nine) && {
                      textAlign: 'center',
                      alignSelf: 'center',
                    },
                  ]}>
                  {title}
                </Text>
              </View>
            </View>
          )}
      </View>
            {content}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avoid: {
    backgroundColor: colors.white,
    flexGrow: 1,
    paddingBottom: tabHeight
  },
  paymentStepHeaderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 16,
    marginTop: 0,
    paddingHorizontal: 20,
    height: 27,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    paddingVertical: 5,
  },
  backImg: {
    marginRight: 12,
  },
  backText: {
    fontFamily: 'FiraGO-Bold',
    fontWeight: '500',
    color: colors.primary,
    fontSize: 14,
    lineHeight: 17,
  },
  titleBox: {
    flex: 1,
  },
  titleText: {
    fontFamily: 'FiraGO-Bold',
    fontWeight: '500',
    color: colors.black,
    fontSize: 14,
    lineHeight: 27,
    flex: 1,
    textAlign: 'right',
    alignSelf: 'stretch',
  },
  verifyContainer: {
    flexGrow: 1,
  },
  stepContainer: {
    marginTop: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 327,
    width: '100%',
    alignSelf: 'center',
  },
  step: {
    width: 18,
    height: 18,
    borderColor: colors.inputBackGround,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontFamily: 'FiraGO-Medium',
    color: colors.placeholderColor,
    fontSize: 12,
    lineHeight: 14,
  },
  activeStep: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  activeStepText: {
    color: colors.white,
  },
  dragableIcon: {
    alignSelf: 'center',
    backgroundColor: colors.black,
    borderRadius: 5,
    width: 40,
    height: 5,
    position: 'absolute',
    top: -10,
  },
  header: {
    marginTop: 20
  }
});

export default Verification;
