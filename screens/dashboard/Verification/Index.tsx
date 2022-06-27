import {RouteProp, useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import userStatuses from '../../../constants/userStatuses';
import Routes from '../../../navigation/routes';
import {tabHeight} from '../../../navigation/TabNav';
import {FetchUserDetail} from '../../../redux/actions/user_actions';
import {
  GetCitizenshipCountries,
  GetCustomerEmploymentStatusTypes,
  GetCustomerExpectedTurnoverTypes,
  GetCustomerWorkTypes,
} from '../../../redux/actions/verification_actions';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import {
  IVerficationState,
  IGlobalState as IVERIFICATIONSTATE,
  SET_VER_COUNTRY,
  SET_VER_COUNTRY2,
  SET_VER_CITY,
  SET_VER_ADDRESS,
  SET_VER_POSTCODE,
  SET_VER_EPLOIMENTSTATUS,
  SET_VER_JOBTYPE,
  SET_VER_COMPLIMENTARY,
  SET_VER_OCCUPIEDPOSITION,
  SET_VER_CUSTOMEREXPECTEDTURNOVERTYPE,
  SET_VER_TRANSACTIONCATREGORIES,
  SET_VER_ANOTHERTRANSACTIONCATREGORIES,
  SET_VER_USERKYCDATA,
  SET_VER_RESETSTATE,
} from '../../../redux/action_types/verification_action_types';
import KvalificaServices, {
  getKycFullYear,
  IKCData,
} from '../../../services/KvalificaServices';
import NavigationService from '../../../services/NavigationService';
import NetworkService from '../../../services/NetworkService';
import {ICitizenshipCountry} from '../../../services/PresentationServive';
import UserService, {
  ICustomerRegistrationNewRequest,
  IExpectedType,
  IFinishCustomerRegistrationRequest,
  IStatus,
  IType2,
} from '../../../services/UserService';
import {getString} from '../../../utils/Converter';
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

export enum documentTypes {
  PASSPORT = 'PASSPORT',
  ID = 'ID'
}

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

export interface ITransactionCategoryInterface {
  id: number;
  value: string;
  active: boolean;
}

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

type RouteParamList = {
  params: {
    verificationStep: number;
    retry?: boolean;
  };
};

const Verification: React.FC = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const VerficationStore = useSelector<IVERIFICATIONSTATE>(
    state => state.VerificationReducer,
  ) as IVerficationState;
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setVerificationStep = (_route: string, step: number) => {
    NavigationService.navigate(_route, {
      verificationStep: step,
      retry: route.params.retry
    });
  };

  const setCountry = (c: ICitizenshipCountry) => {
    dispatch({type: SET_VER_COUNTRY, country: c});
  };

  const setCountry2 = (c: ICitizenshipCountry | undefined) => {
    dispatch({type: SET_VER_COUNTRY2, country2: c});
  };

  const setCity = (c: string) => {
    dispatch({type: SET_VER_CITY, city: c});
  };

  const setAddress = (c: string) => {
    dispatch({type: SET_VER_ADDRESS, address: c});
  };

  const setPostCode = (c: string) => {
    dispatch({type: SET_VER_POSTCODE, postCode: c});
  };

  const setSlectedEmploymentStatus = (c: IStatus) => {
    dispatch({type: SET_VER_EPLOIMENTSTATUS, selectedEmploymentStatus: c});
  };

  const setSelectedJobType = (c: IType2) => {
    dispatch({type: SET_VER_JOBTYPE, selectedJobType: c});
  };

  const setComplimentary = (c: string) => {
    dispatch({type: SET_VER_COMPLIMENTARY, complimentary: c});
  };

  const setOccupiedPosition = (c: string) => {
    dispatch({type: SET_VER_OCCUPIEDPOSITION, occupiedPosition: c});
  };

  const setCustomerExpectedTurnoverType = (c: IExpectedType | undefined) => {
    dispatch({
      type: SET_VER_CUSTOMEREXPECTEDTURNOVERTYPE,
      customerExpectedTurnoverType: c,
    });
  };

  const setTransactionCategories = (c: ITransactionCategoryInterface[]) => {
    dispatch({type: SET_VER_TRANSACTIONCATREGORIES, transactionCategories: c});
  };

  const setAnotherTransactionCategory = (c: string) => {
    dispatch({
      type: SET_VER_ANOTHERTRANSACTIONCATREGORIES,
      anotherTransactionCategory: c,
    });
  };

  const setStartVerification = (c: boolean) => {
    NavigationService.navigate(Routes.KvalifcaVerification);
  };

  const setUserKYCData = (c: IKCData | undefined) => {
    dispatch({type: SET_VER_USERKYCDATA, userKYCData: c});
  };

  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const dispatch = useDispatch();

  const onToggletransactionCategoryActive = (
    category: ITransactionCategoryInterface,
  ) => {
    let _categoryes = [...VerficationStore.transactionCategories];
    let categoryIndex = _categoryes.findIndex(
      transact => transact.value === category.value,
    );
    if (categoryIndex >= 0) {
      _categoryes[categoryIndex].active = !_categoryes[categoryIndex].active;
      setTransactionCategories([..._categoryes]);
    }
  };

  const welcomeScreenAction = (action: number) => {
    if (action === 0) {
      getCitizenshipCountries();
    }
  };

  useEffect(() => {
    if(route.params.verificationStep >= VERIFICATION_STEPS.step_four && !VerficationStore.countryes) {
      dispatch(
        GetCitizenshipCountries(),
      );
    }
  }, [route.params.verificationStep])

  const stepTwoScreenAction = () => {
    if (
      VerficationStore.employmentStatuses &&
      VerficationStore.customerWorkTypes
    ) {
      setVerificationStep(
        Routes.VerificationStep2,
        VERIFICATION_STEPS.step_two,
      );
      return;
    }
    dispatch(GetCustomerEmploymentStatusTypes());
    dispatch(GetCustomerWorkTypes());
  };

  const stepThreeScreenAction = () => {
    getCustomerExpectedTurnoverTypes();
  };

  const onStartVerification = () => {
    setStartVerification(true);
  };

  const getCitizenshipCountries = () => {
    dispatch(
      GetCitizenshipCountries(() => {
        setVerificationStep(
          Routes.VerificationStep1,
          VERIFICATION_STEPS.step_one,
        );
      }),
    );
  };

  const getCustomerExpectedTurnoverTypes = () => {
    if (VerficationStore.customerExpectedTurnoverTypes) {
      setVerificationStep(
        Routes.VerificationStep3,
        VERIFICATION_STEPS.step_three,
      );
      return;
    }

    dispatch(
      GetCustomerExpectedTurnoverTypes(() => {
        setVerificationStep(
          Routes.VerificationStep3,
          VERIFICATION_STEPS.step_three,
        );
      }),
    );
  };

  const checkKycSession = () => {
    if(route.params.retry) {
      CheckKycForReprocess();
      return;
    }
    setIsLoading(true);
    KvalificaServices.CheckKycSession().subscribe({
      next: Response => {
        if (Response.data.ok) {
          if (Response.data.data?.skipKycSession) {
            getKycSessionData();
          } else {
            setVerificationStep(
              Routes.VerificationStep5,
              VERIFICATION_STEPS.step_five,
            );
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

  const CheckKycForReprocess = () => {
    setIsLoading(true);
    KvalificaServices.CheckKycForReprocess().subscribe({
      next: Response => {
        if (Response.data.ok) {
          if (Response.data.data?.skipKycSession) {
            getKycSessionData();
          } else {
            setVerificationStep(
              Routes.VerificationStep5,
              VERIFICATION_STEPS.step_five,
            );
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
        setVerificationStep(
          Routes.VerificationStep6,
          VERIFICATION_STEPS.step_six,
        );
      },
    });
  };

  const onCustomerRegistration = () => {
    if(isLoading) return;

    setIsLoading(true);
    const data: ICustomerRegistrationNewRequest = {
      isResident: VerficationStore.country?.countryID == 79 ? true : false,
      factCountryID: VerficationStore.country?.countryID,
      factCity: VerficationStore.city,
      factCityID: 0,
      factAddress: VerficationStore.address,
      factPostalCode: VerficationStore.postCode,
      legalCountryID: VerficationStore.country?.countryID,
      legalCity: VerficationStore.city,
      legalCityID: 0,
      legalAddress: VerficationStore.address,
      legalPostalCode: VerficationStore.postCode,
      employmentStatusCode:
        VerficationStore.selectedEmploymentStatus?.employmentStatusCode,
      employmentTypeCode:
        VerficationStore.selectedJobType?.customerEmploymentTypeCode,
      employer: VerficationStore.complimentary,
      workPosition: VerficationStore.occupiedPosition,
      expectedTurnoverCode:
        VerficationStore.customerExpectedTurnoverType?.expectedTurnoverCode,
      hasUtility: VerficationStore.transactionCategories.filter(
        c => c.id === 1,
      )[0].active,
      hasTransport: VerficationStore.transactionCategories.filter(
        c => c.id === 2,
      )[0].active,
      hasTelecomunication: false,
      hasInternatiolalTransactions:
        VerficationStore.transactionCategories.filter(c => c.id === 3)[0]
          .active,
      hasGambling: VerficationStore.transactionCategories.filter(
        c => c.id === 4,
      )[0].active,
      hasOther: VerficationStore.transactionCategories.filter(
        c => c.id === 5,
      )[0].active,
      otherDesctiption: VerficationStore.anotherTransactionCategory,
      termID: 1,
    };

    UserService.CustomerRegistration(data).subscribe({
      next: Response => {
        if (Response.data.ok) {
          setVerificationStep(
            Routes.VerificationStep4,
            VERIFICATION_STEPS.step_four,
          );
        }
      },
      complete: () => {
        setIsLoading(false);
        setVerificationStep(
          Routes.VerificationStep4,
          VERIFICATION_STEPS.step_four,
        );
      },
      error: () => {
        setIsLoading(false);
      },
    });
  };

  const onFinishCostumerRegistration = () => {
    if(isLoading){
      return;
    }
    setIsLoading(true);
    let data: IFinishCustomerRegistrationRequest = {
      customerSelfContent: VerficationStore.userKYCData?.customerSelfContent,
      customerSelfName: VerficationStore.userKYCData?.customerSelfName,
      customerSelf: VerficationStore.userKYCData?.customerSelf,
      documentType:
        VerficationStore.userKYCData?.documetType === 'ID'
          ? 'Enum_IDCard'
          : 'Enum_Passport',
      documentBackSideContent:
        VerficationStore.userKYCData?.documentBackSideContent,
      documentBackSide: VerficationStore.userKYCData?.documentBackSide,
      documentBackSideName: VerficationStore.userKYCData?.documentBackSideName,
      documentFrontSideContent:
        VerficationStore.userKYCData?.documentFrontSideContent,
      documentFrontSide: VerficationStore.userKYCData?.documentFrontSide,
      documentFrontSideName:
        VerficationStore.userKYCData?.documentFrontSideName,
      birthDate: `${VerficationStore.userKYCData?.birthDate}-01-01`,
      name: VerficationStore.userKYCData?.firstName,
      surname: VerficationStore.userKYCData?.lastName,
      birthCityId: 0,
      citizenshipCountryID: VerficationStore.country?.countryID,
      secondaryCitizenshipCountryID:
        VerficationStore.country2?.countryID || undefined,
    };

    if (VerficationStore.userKYCData?.documetType === 'ID') {
      data = {...data, personalID: VerficationStore.userKYCData.personalNumber};
    } else {
      data = {
        ...data,
        passportNumber: VerficationStore.userKYCData?.documentNumber,
      };
    }

    UserService.FinishCostumerRegistration(data).subscribe({
      next: Response => {
        if (Response.data.ok) {
          setVerificationStep(
            Routes.VerificationStep9,
            VERIFICATION_STEPS.step_nine,
          );
        }
      },
      complete:() => {
        setIsLoading(false);
      },
      error: () => {setIsLoading(false);},
    });
  };

  useEffect(() => {
    if (
      VerficationStore.employmentStatuses &&
      VerficationStore.customerWorkTypes &&
      route.params.verificationStep <= VERIFICATION_STEPS.step_one
    ) {
      setIsLoading(false);
      setVerificationStep(
        Routes.VerificationStep2,
        VERIFICATION_STEPS.step_two,
      );
    }
  }, [VerficationStore.employmentStatuses, VerficationStore.customerWorkTypes]);

  const complate = () => {
    NetworkService.CheckConnection(() => {
      dispatch({type: SET_VER_RESETSTATE});
      dispatch(FetchUserDetail());
    });
    NavigationService.navigate(Routes.Dashboard);
  };

  const {documentVerificationStatusCode} = userData.userDetails || {};

  useEffect(() => {
    if (
      documentVerificationStatusCode === userStatuses.Enum_PartiallyProcessed &&
      route.params.verificationStep > VERIFICATION_STEPS.welcome &&
      route.params.verificationStep < VERIFICATION_STEPS.step_four
    ) {
      setVerificationStep(
        Routes.VerificationStep4,
        VERIFICATION_STEPS.step_four,
      );
    }
  }, [documentVerificationStatusCode, route.params.verificationStep]);


  let content: JSX.Element = (
    <Welcome
      onActionClick={welcomeScreenAction}
      loading={VerficationStore.isLoading || isLoading}
    />
  );
  if (route.params.verificationStep === VERIFICATION_STEPS.step_one) {
    content = (
      <StepOne
        loading={VerficationStore.isLoading || isLoading}
        countryes={VerficationStore.countryes}
        selectedCountry={VerficationStore.country}
        onSetCountry={setCountry}
        city={VerficationStore.city}
        onSetCity={setCity}
        address={VerficationStore.address}
        onSetAddress={setAddress}
        postCode={VerficationStore.postCode}
        onSetPostCode={setPostCode}
        onComplate={stepTwoScreenAction}
      />
    );
  } else if (route.params.verificationStep === VERIFICATION_STEPS.step_two) {
    content = (
      <StepTwo
        loading={VerficationStore.isLoading || isLoading}
        employmentStatuses={VerficationStore.employmentStatuses}
        customerWorkTypes={VerficationStore.customerWorkTypes}
        onSetEmploymentStatus={setSlectedEmploymentStatus}
        selectedEmploymentStatus={VerficationStore.selectedEmploymentStatus}
        selectedJobType={VerficationStore.selectedJobType}
        onSetJobTypes={setSelectedJobType}
        occupiedPosition={VerficationStore.occupiedPosition}
        onSetOccupiedPositios={setOccupiedPosition}
        onSetComplimentary={setComplimentary}
        complimentary={VerficationStore.complimentary}
        onComplate={stepThreeScreenAction}
      />
    );
  } else if (route.params.verificationStep === VERIFICATION_STEPS.step_three) {
    content = (
      <StepThree
        loading={VerficationStore.isLoading || isLoading}
        setAnotherTransactionCategory={setAnotherTransactionCategory}
        anotherTransactionCategory={VerficationStore.anotherTransactionCategory}
        transactionCategories={VerficationStore.transactionCategories}
        expectedTurnovers={VerficationStore.customerExpectedTurnoverTypes}
        onToggleTransactionCategory={onToggletransactionCategoryActive}
        selectedExpectedTurnover={VerficationStore.customerExpectedTurnoverType}
        onSetExpectedTurnover={setCustomerExpectedTurnoverType}
        onComplate={() => onCustomerRegistration()}
      />
    );
  } else if (route.params.verificationStep === VERIFICATION_STEPS.step_four) {
    content = (
      <StepFour loading={VerficationStore.isLoading || isLoading} onComplate={() => checkKycSession()} />
    );
  } else if (route.params.verificationStep === VERIFICATION_STEPS.step_five) {
    content = <StepSix loading={VerficationStore.isLoading || isLoading} onComplate={onStartVerification} />;
  } else if (route.params.verificationStep === VERIFICATION_STEPS.step_six) {
    content = (
      <StepSeven
        notEditable={route.params.retry}
        kycData={VerficationStore.userKYCData}
        onUpdateData={setUserKYCData}
        onComplate={() =>
          setVerificationStep(
            Routes.VerificationStep7,
            VERIFICATION_STEPS.step_seven,
          )
        }
      />
    );
  } else if (route.params.verificationStep === VERIFICATION_STEPS.step_seven) {
    content = (
      <StepEight
        notEditable={route.params.retry}
        countryes={VerficationStore.countryes}
        selectedCountry={VerficationStore.country}
        onSetCountry={setCountry}
        selectedCountry2={VerficationStore.country2}
        onSetCountry2={setCountry2}
        kycData={VerficationStore.userKYCData}
        onUpdateData={setUserKYCData}
        onComplate={() =>
          setVerificationStep(
            Routes.VerificationStep8,
            VERIFICATION_STEPS.step_eight,
          )
        }
      />
    );
  } else if (route.params.verificationStep === VERIFICATION_STEPS.step_eight) {
    content = (
      <StepNine
      loading={VerficationStore.isLoading || isLoading}
        onComplate={() => onFinishCostumerRegistration()}
        kycData={VerficationStore.userKYCData}
      />
    );
  } else if (route.params.verificationStep === VERIFICATION_STEPS.step_nine) {
    content = <Finish loading={VerficationStore.isLoading || isLoading} onComplate={complate} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.avoid}>
      <KeyboardAvoidingView behavior="padding" style={styles.avoid}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            {route.params.verificationStep > VERIFICATION_STEPS.welcome &&
              route.params.verificationStep !== VERIFICATION_STEPS.step_four &&
              route.params.verificationStep !== VERIFICATION_STEPS.step_five &&
              route.params.verificationStep !== VERIFICATION_STEPS.step_six &&
              route.params.verificationStep !== VERIFICATION_STEPS.step_seven &&
              route.params.verificationStep !== VERIFICATION_STEPS.step_eight &&
              route.params.verificationStep !==
                VERIFICATION_STEPS.step_nine && (
                <StepsContent currentStep={route.params.verificationStep} />
              )}

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
    paddingBottom: tabHeight,
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
    marginTop: 20,
  },
});

export default Verification;
