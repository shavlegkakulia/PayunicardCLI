import React, {createRef, useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView as ReactScroll,
  TouchableOpacity,
  Image,
  Text,
  NativeScrollEvent,
  ImageSourcePropType,
  Dimensions,
  ActivityIndicator,
  Platform,
  Switch,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import screenStyles from '../../../styles/screens';
import DashboardLayout from '../../DashboardLayout';
import TransactionsList from '../transactions/TransactionsList';
import {
  RouteProp,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import UserService, {
  IAccountBallance,
  IChangeConditionRisklevelUFCRequest,
  IFund,
  IGetUserBlockedBlockedFundslistRequest,
} from '../../../services/UserService';
import PaginationDots from '../../../components/PaginationDots';
import {getNumber, getString} from '../../../utils/Converter';
import {TYPE_UNICARD} from '../../../constants/accountTypes';
import NetworkService from '../../../services/NetworkService';
import {
  FetchUserAccounts,
  FetchUserAccountStatements,
} from '../../../redux/actions/user_actions';
import envs from './../../../config/env';
import ActionSheetCustom from './../../../components/actionSheet';
import AppButton from '../../../components/UI/AppButton';
import AccountService from '../../../services/AccountService';
import FullScreenLoader from '../../../components/FullScreenLoading';
import FloatingLabelInput from '../../../containers/otp/Otp';
import OTPService, {
  GeneratePhoneOtpByUserRequest,
} from '../../../services/OTPService';
import {NAVIGATION_ACTIONS} from '../../../redux/action_types/navigation_action_types';
import Routes from '../../../navigation/routes';
import {TRANSFERS_ACTION_TYPES} from '../../../redux/action_types/transfers_action_types';
import {
  IGlobalPaymentState,
  IPaymentState,
  PAYMENTS_ACTIONS,
} from '../../../redux/action_types/payments_action_type';
import {
  ICategory,
  IMerchantServicesForTemplateRequest,
  IService,
} from '../../../services/PresentationServive';
import {
  getPayCategoriesServices,
  GetPaymentDetails,
} from '../../../redux/actions/payments_actions';
import PresentationService from './../../../services/PresentationServive';
import CardService, {IGetBarcodeRequest} from '../../../services/CardService';
import NavigationService from '../../../services/NavigationService';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import AccountCard from './AccountCard';
import userStatuses from '../../../constants/userStatuses';
import {tabHeight} from '../../../navigation/TabNav';
import SmsRetriever from 'react-native-sms-retriever';

type RouteParamList = {
  Account: {
    account: IAccountBallance;
  };
};

const PACKET_TYPE_IDS = {
  wallet: 1,
  upera: 2,
  uniPlus: 3,
  uniUltra: 4,
  unicard: TYPE_UNICARD,
};

const CARD_ACTIONS = {
  card_block: 1,
  change_pin: 2,
  account_totpup: 3,
};

const ACTION_SHEET_STATUSES = {
  start: 0,
  error: 1,
  succes: 2,
  otp: 3,
};

interface IActionSheetTypes {
  actionSheetTitle?: string;
  actionSheetStatus?: number | undefined;
  actionSheetType?: number | undefined;
}

const ProductDetail: React.FC = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;

  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [transferSectionStep, setTransferSectionStep] = useState<number>(0);
  const [paymentSectionStep, setPaymentSectionStep] = useState<number>(0);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>();
  const [maskedPhoneNumber, setMaskedNumber] = useState<string>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [
    {actionSheetTitle, actionSheetStatus, actionSheetType},
    setActionSheetStep,
  ] = useState<IActionSheetTypes>({
    actionSheetTitle: '',
    actionSheetStatus: ACTION_SHEET_STATUSES.start,
    actionSheetType: undefined,
  });
  const [barcode, setBarcode] = useState<string>();
  const [isBarCodeLoading, setIsBarCodeLoading] = useState<boolean>(true);
  const route = useRoute<RouteProp<RouteParamList, 'Account'>>();
  const carouselRef = createRef<ScrollView>();
  const [isFundsLoading, setIsFundsLoading] = useState<boolean>(false);
  const [funds, setFunds] = useState<IFund[] | undefined>();
  const [selectedFromAccount, setSelectedFromAccount] = useState<
    IAccountBallance | undefined
  >(undefined);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [hrmLoading, setHrmLoading] = useState<boolean>(false);
  const [isHrmProcessing, setIsHrmProcessing] = useState<boolean>(false);
  const {documentVerificationStatusCode, customerVerificationStatusCode} =
    userData.userDetails || {};
    const [currentHRMAction, setCurrentHRMAction] = useState<number>(0);

  const isUserVerified =
    documentVerificationStatusCode === userStatuses.Enum_Verified &&
    customerVerificationStatusCode === userStatuses.Enum_Verified;

  const toggleHrmSwitch = () => {
    if (hrmLoading || actionLoading) return;
    setCurrentHRMAction(1);
    setIsEnabled(previousState => !previousState);
    setIsHrmProcessing(true);
    SendPhoneOTP();
  };
  const toggleHrmSwitch2 = () => {
    if (hrmLoading || actionLoading) return;
    setCurrentHRMAction(2);
    setIsEnabled2(previousState2 => !previousState2);
    setIsHrmProcessing(true);
    SendPhoneOTP();
  };

  const PaymentStore = useSelector<IGlobalPaymentState>(
    state => state.PaymentsReducer,
  ) as IPaymentState;

  const dispatch = useDispatch();

  const GenerateBarcode = (accountNumber: string) => {
    const data: IGetBarcodeRequest = {
      input: accountNumber,
    };
    CardService.GenerateBarcode(data).subscribe({
      next: Response => {
        setBarcode(getString(Response.data.data?.barcode));
      },
      complete: () => setIsBarCodeLoading(false),
      error: () => {
        setIsBarCodeLoading(false);
      },
    });
  };

  const fetchAccounts = () => {
    NetworkService.CheckConnection(() => {
      dispatch(FetchUserAccounts());
    });
  };

  const fetchAccountStatements = () => {
    NetworkService.CheckConnection(() => {
      dispatch(
        FetchUserAccountStatements({accountID: route.params.account.accountId}),
      );
    });
  };

  const onFetchData = () => {
    fetchAccounts();
  };

  const routes = useNavigationState(state => state.routes);

  const transferBetweenAccounts = () => {
    if (!isUserVerified) return;
    const currentRoute = routes[routes.length - 1].name;
    dispatch({
      type: NAVIGATION_ACTIONS.SET_PARENT_ROUTE,
      parentRoute: currentRoute,
    });
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_SELECTED_FROM_ACCOUNT,
      selectedFromAccount: selectedFromAccount,
    });
    NavigationService?.navigate(
      Routes.TransferBetweenAcctounts_CHOOSE_ACCOUNTS,
      {
        transferStep: Routes.TransferBetweenAcctounts_CHOOSE_ACCOUNTS,
      },
    );
  };

  const transferToBank = () => {
    if (!isUserVerified) return;
    const currentRoute = routes[routes.length - 1].name;
    dispatch({
      type: NAVIGATION_ACTIONS.SET_PARENT_ROUTE,
      parentRoute: currentRoute,
    });
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_SELECTED_FROM_ACCOUNT,
      selectedFromAccount: selectedFromAccount,
    });
    NavigationService?.navigate(Routes.TransferToBank_CHOOSE_ACCOUNTS, {
      transferStep: Routes.TransferToBank_CHOOSE_ACCOUNTS,
    });
  };

  const transferToUni = () => {
    if (!isUserVerified) return;
    const currentRoute = routes[routes.length - 1].name;
    dispatch({
      type: NAVIGATION_ACTIONS.SET_PARENT_ROUTE,
      parentRoute: currentRoute,
    });
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_SELECTED_FROM_ACCOUNT,
      selectedFromAccount: selectedFromAccount,
    });
    NavigationService?.navigate(Routes.TransferToUni_CHOOSE_ACCOUNTS, {
      transferStep: Routes.TransferToUni_CHOOSE_ACCOUNTS,
    });
  };

  const transferConvertation = () => {
    if (!isUserVerified) return;
    const currentRoute = routes[routes.length - 1].name;
    dispatch({
      type: NAVIGATION_ACTIONS.SET_PARENT_ROUTE,
      parentRoute: currentRoute,
    });
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_SELECTED_FROM_ACCOUNT,
      selectedFromAccount: selectedFromAccount,
    });
    NavigationService?.navigate(Routes.TransferConvertation_CHOOSE_ACCOUNTS, {
      transferStep: Routes.TransferConvertation_CHOOSE_ACCOUNTS,
    });
  };

  const breackWords = (text: string | undefined) => {
    const words = text ? text.split(' ') : [];
    return (
      <View>
        {words.map((word, index) => (
          <Text
            key={index}
            style={styles.sectionContainerItemDetailsTitle}
            numberOfLines={2}>
            {word}
          </Text>
        ))}
      </View>
    );
  };

  const onChangeCardIndex = (nativeEvent: NativeScrollEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slide != currentCardIndex) {
        //if(slide === 3) return;
        setCurrentCardIndex(slide);
      }
    }
  };

  const onChangeTransferSectionStep = (nativeEvent: NativeScrollEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slide != transferSectionStep) {
        //if(slide === 3) return;
        setTransferSectionStep(slide);
      }
    }
  };

  const onChangePaymentSectionStep = (nativeEvent: NativeScrollEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slide != paymentSectionStep) {
        //if(slide === 3) return;
        setPaymentSectionStep(slide);
      }
    }
  };

  const getCardLogo = (type: number): ImageSourcePropType => {
    let ccyLogo = require('./../../../assets/images/accountCardsTypeIcon.png');
    if (type == 1) {
      ccyLogo = require('./../../../assets/images/visa_big.png');
    } else if (type == 2) {
      ccyLogo = require('./../../../assets/images/mastercard_24x15.png');
    } else if (type == TYPE_UNICARD) {
      ccyLogo = require('./../../../assets/images/uniLogo.png');
    }
    return ccyLogo;
  };

  const GetUserBlockedFunds = () => {
    setIsFundsLoading(true);
    let data: IGetUserBlockedBlockedFundslistRequest | undefined = {
      accountNumer: route.params.account.accountNumber,
    };
    if (!route.params.account.accountNumber) {
      data = undefined;
    }
    UserService.getUserBlockedFunds(data).subscribe({
      next: Response => {
        if (Response.data.ok) {
          setFunds(Response.data.data?.funds);
        }
      },
      complete: () => {
        setIsFundsLoading(false);
      },
      error: err => {
        setIsFundsLoading(false);
      },
    });
  };

  const cardBlock = () => {
    NetworkService.CheckConnection(() => {
      if (route.params.account.cards?.length) {
        setActionLoading(true);
        let cardId: number = getNumber(
          route.params.account.cards[currentCardIndex]?.cardID,
        );
        AccountService.Block({cardId: cardId}).subscribe({
          next: Response => {
            if (Response.data.ok) {
              setActionSheetStep({
                actionSheetType,
                actionSheetStatus: ACTION_SHEET_STATUSES.succes,
                actionSheetTitle: translate.t('products.cardBlocked'),
              });
            }
          },
          complete: () => {
            setActionLoading(false);
          },
          error: err => {
            setActionLoading(false);
            setActionSheetStep({
              actionSheetStatus: ACTION_SHEET_STATUSES.error,
              actionSheetType,
              actionSheetTitle: translate.t('generalErrors.errorOccurred'),
            });
          },
        });
      }
    });
  };

  const startPinChange = () => {
    setActionSheetStep({
      actionSheetTitle: translate.t('products.confirmPinCodeChange'),
      actionSheetStatus: ACTION_SHEET_STATUSES.start,
      actionSheetType: CARD_ACTIONS.change_pin,
    });
  };

  const startAccountTopup = () => {
    NavigationService.navigate(Routes.Topup, {
      currentAccount: route.params.account,
    });
  };

  const startCardBlock = () => {
    setActionSheetStep({
      actionSheetTitle: translate.t('products.reallyNeedBlockCard'),
      actionSheetStatus: ACTION_SHEET_STATUSES.start,
      actionSheetType: CARD_ACTIONS.card_block,
    });
  };

  const pinChangeActions = () => {
    if (actionSheetStatus === ACTION_SHEET_STATUSES.start) {
      setActionSheetStep({
        actionSheetTitle: '',
        actionSheetStatus: ACTION_SHEET_STATUSES.otp,
        actionSheetType,
      });
    } else if (actionSheetStatus === ACTION_SHEET_STATUSES.otp) {
      ChangePin();
    } else if (
      actionSheetStatus === ACTION_SHEET_STATUSES.succes ||
      actionSheetStatus === ACTION_SHEET_STATUSES.error
    ) {
      closeActionSheet();
    }
  };

  const SendPhoneOTP = () => {
    NetworkService.CheckConnection(() => {
      setActionLoading(true);

      let OTP: GeneratePhoneOtpByUserRequest = {
        userName: userData.userDetails?.username,
      };
      OTPService.GeneratePhoneOtpByUser({OTP}).subscribe({
        next: Response => {
          if (Response.data.ok) {
            setMaskedNumber(Response.data.data?.phoneMask);
          }
        },
        error: () => {
          setActionLoading(false);
          if(currentHRMAction === 1) {
            setIsEnabled(false)
          } else if(currentHRMAction === 2) {
            setIsEnabled2(false)
          }
        },
        complete: () => {
          setActionLoading(false)
        },
      });
    });
  };

  const ChangePin = () => {
    if (route.params.account.cards?.length) {
      AccountService.pin({
        cardid: route.params.account.cards[currentCardIndex]?.cardID,
        otp: otp,
      }).subscribe({
        next: Response => {
          if (Response.data.OK) {
            setOtp(undefined);
            setActionSheetStep({
              actionSheetType,
              actionSheetStatus: ACTION_SHEET_STATUSES.succes,
              actionSheetTitle: translate.t('products.pinCodeChanged'),
            });
          }
        },
        complete: () => {
          setActionLoading(false);
        },
        error: err => {
          setActionLoading(false);
          setOtp(undefined);
          setActionSheetStep({
            actionSheetStatus: ACTION_SHEET_STATUSES.error,
            actionSheetType,
            actionSheetTitle: translate.t('generalErrors.errorOccurred'),
          });
        },
      });
    }
  };

  const gotoPaymentStep = (
    url?: string,
    paymentStep?: number,
    icat?: ICategory[],
  ) => {
    dispatch({
      type: NAVIGATION_ACTIONS.SET_PARENT_ROUTE,
      parentRoute: Routes.Products,
    });
    NavigationService?.navigate(url || Routes.Payments_STEP1, {
      paymentStep:
        getNumber(paymentStep) >= 0
          ? paymentStep
          : url || Routes.Payments_STEP1,
      step: 1,
      category: [...(icat || [])],
    });
  };

  const GetMerchantServices = (
    data: IMerchantServicesForTemplateRequest,
    onComplate: Function,
    onError: Function,
  ) => {
    NetworkService.CheckConnection(() => {
      PresentationService.GetMerchantServices(data).subscribe({
        next: Response => {
          const merchant = [...Response.data.data?.merchants]?.map(cat => {
            cat.isService = true;
            cat.hasServices = true;
            return cat;
          });
          onComplate(merchant);
        },
        error: () => {
          onError();
        },
      });
    });
  };

  const getCategories = (
    parentID: number = 0,
    isService: boolean = false,
    hasService: boolean = false,
    hasChildren: boolean = false,
    navigate: boolean = false,
    categoryTitle: string = '',
    accept: boolean = false,
  ) => {
    if (!accept) return;
    if (PaymentStore.isCategoriesLoading) return;
    // dispatch({
    //   type: PAYMENTS_ACTIONS.PAYMENT_SET_SELECTED_ACCOUNT,
    //   selectedAccount: props.selectdeAccount,
    // });

    dispatch({
      type: PAYMENTS_ACTIONS.SET_PAYEMNT_ACTIVE_CATEGORY_TITLE,
      title: categoryTitle,
    });

    dispatch({
      type: PAYMENTS_ACTIONS.SET_IS_PAYMENT_CATEGORIES_LOADING,
      isCategoriesLoading: true,
    });

    const onComplate = (cats: ICategory[] | undefined, url?: string) => {
      dispatch({
        type: PAYMENTS_ACTIONS.SET_IS_PAYMENT_CATEGORIES_LOADING,
        isCategoriesLoading: false,
      });

      if (navigate) {
        gotoPaymentStep(url, undefined, cats);
      }
    };

    const onError = () => {
      dispatch({
        type: PAYMENTS_ACTIONS.SET_IS_PAYMENT_CATEGORIES_LOADING,
        isCategoriesLoading: false,
      });
    };

    if (isService && hasService && !hasChildren) {
      let currentService: ICategory[] | IService[],
        merchantCode,
        merchantServiceCode;

      currentService = [...(categories || [])].filter(
        c => c.name === categoryTitle,
      );

      if (!currentService.length) {
        //from the search
        currentService = PaymentStore.services.filter(
          service => service.categoryID === parentID,
        );

        merchantCode = PaymentStore.services[0]?.merchantCode;
        merchantServiceCode = PaymentStore.services[0]?.merchantServiceCode;
      } else {
        merchantCode = currentService[0].merchantCode;
        merchantServiceCode = currentService[0].merchantServiceCode;
      }

      dispatch({
        type: PAYMENTS_ACTIONS.SET_CURRENT_PAYMENT_SERVICE,
        currentService: currentService[0],
      });
  
      dispatch({
        type: PAYMENTS_ACTIONS.SET_IS_PAYMENT_SERVICE,
        isService: true,
      });

      dispatch(
        GetPaymentDetails(
          {
            ForMerchantCode: merchantCode,
            ForMerchantServiceCode: merchantServiceCode,
            ForOpClassCode: 'B2B.F',
          },
          () => onComplate(undefined, Routes.Payments_INSERT_ABONENT_CODE),
          onError,
        ),
      );

      return;
    }

    /* categories contains merchant and also service */
    if (!isService && hasService && !hasChildren) {
     
      GetMerchantServices({CategoryID: parentID}, onComplate, onError);
    } /* categories contains merchants */ else if (
      !isService &&
      hasService &&
      hasChildren
    ) {
     
      dispatch(getPayCategoriesServices(parentID, onComplate, onError));
    } /* categories contains only services */ else if (
      !isService &&
      !hasService
    ) {
  
      dispatch(
        getPayCategoriesServices(
          parentID,
          (cats: ICategory[]) => {
            if (!categories) {
              setCategories(cats);
            }
            onComplate(cats);
          },
          onError,
        ),
      );
    }
  };

  const closeActionSheet = () => {
    setActionSheetStep({});
  };

  const changeConditionRisklevelUFC = () => {
    if (hrmLoading) return;
    let cardHrm = 0;
    if (isEnabled === true && isEnabled2 === true) {
      cardHrm = 1;
    } else if (isEnabled === false && isEnabled2 === false) {
      cardHrm = 0;
    } else if (isEnabled === true && isEnabled2 === false) {
      cardHrm = 2;
    } else if (isEnabled === false && isEnabled2 === true) {
      cardHrm = 3;
    }

    let cardId = 0;

    if (route?.params?.account.cards) {
      cardId = getNumber(route?.params?.account.cards[currentCardIndex].cardID);
    }

    const data: IChangeConditionRisklevelUFCRequest = {
      status: cardHrm,
      cardID: cardId,
      otp: getString(otp),
    };
    
    setHrmLoading(true);

    UserService.changeConditionRisklevelUFC(data).subscribe({
      next: Response => {
        if (Response.data.ok) {
          dispatch(FetchUserAccountStatements({}));
        }
      },
      complete: () => {
        setHrmLoading(false);
        setOtp(undefined);
        setHrmLoading(false);
        setIsHrmProcessing(false);
        setCurrentHRMAction(0);
      },
      error: err => {
     
        if(currentHRMAction === 1) {
          setIsEnabled(false)
        } else if(currentHRMAction === 2) {
          setIsEnabled2(false)
        }
        setCurrentHRMAction(0);
        setHrmLoading(false);
        setOtp(undefined);
        setHrmLoading(false);
        setIsHrmProcessing(false);
      },
    });
  };

  useEffect(() => {
    if (route.params.account.type !== TYPE_UNICARD) {
      GetUserBlockedFunds();
    }
  }, []);

  useEffect(() => {
    if (actionSheetStatus == ACTION_SHEET_STATUSES.otp) {
      SendPhoneOTP();
    }
  }, [actionSheetStatus]);

  useEffect(() => {
    onFetchData();
  }, []);

  useEffect(() => {
    fetchAccountStatements();

    if (route?.params?.account.cards) {
      const curCardHrm = route?.params?.account.cards[currentCardIndex]?.hrm;
      if (curCardHrm === 1) {
        setIsEnabled(true);
        setIsEnabled2(true);
      } else if (curCardHrm === 0) {
        setIsEnabled(false);
        setIsEnabled2(false);
      } else if (curCardHrm === 2) {
        setIsEnabled(true);
        setIsEnabled2(false);
      } else if (curCardHrm === 3) {
        setIsEnabled(false);
        setIsEnabled2(true);
      }
    }
  }, [route?.params?.account]);

  useEffect(() => {
    setSelectedFromAccount(route?.params?.account);
    if (route.params.account.type === PACKET_TYPE_IDS.unicard)
      GenerateBarcode(getString(route?.params?.account.accountNumber));
  }, [route?.params?.account]);

  const onSmsListener = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        SmsRetriever.addSmsListener(event => {
          const otp = /(\d{4})/g.exec(getString(event.message))![1];
          setOtp(otp);
        }); 
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    onSmsListener();

    return () => SmsRetriever.removeSmsListener();
  }, []);

  const dimension = Dimensions.get('window');

  const cardWidth = dimension.width - 40;

  const actionSheetHeight = 410;

  const isDisabled = isUserVerified ? {} : {opacity: 0.5};

  return (
    <DashboardLayout>
      {actionLoading && (
        <FullScreenLoader background={colors.none} hideLoader />
      )}

      <ReactScroll style={[screenStyles.screenContainer, styles.container]}>
        <View style={styles.transfersSectionContainer}>
          {route.params.account.type !== PACKET_TYPE_IDS.wallet &&
            route.params.account.type !== PACKET_TYPE_IDS.unicard &&
            getNumber(route.params.account.cards?.length) > 1 && (
              <PaginationDots
                step={currentCardIndex}
                length={route.params.account.cards?.length}
              />
            )}
          {route.params.account.type !== PACKET_TYPE_IDS.wallet &&
          route.params.account.type !== PACKET_TYPE_IDS.unicard ? (
            <ScrollView
              style={styles.cards}
              ref={carouselRef}
              onScroll={({nativeEvent}) => onChangeCardIndex(nativeEvent)}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              horizontal>
              {getNumber(route.params.account.cards?.length) > 0 ? (
                route.params.account.cards?.map((card, index) => (
                  <View
                    style={[screenStyles.wraper, styles.container]}
                    key={getNumber(card.cardID) + index}>
                    <AccountCard
                      account={route.params.account}
                      cardMask={card.maskedCardNumber}
                      cardContainerStyle={{width: cardWidth}}
                      logo={getCardLogo(getNumber(card.cardTypeID))}
                    />
                  </View>
                ))
              ) : (
                <View style={[screenStyles.wraper, styles.container]}>
                  <AccountCard
                    account={route.params.account}
                    cardContainerStyle={{width: cardWidth}}
                  />
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={[screenStyles.wraper, styles.container]}>
              <AccountCard
                account={route.params.account}
                cardContainerStyle={{width: cardWidth}}
              />
              {route.params.account.type === PACKET_TYPE_IDS.unicard &&
                (isBarCodeLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={styles.loadingBox}
                  />
                ) : (
                  <Image
                    source={{
                      uri: `data:image/png;base64,${barcode}`,
                    }}
                    style={styles.barCode}
                  />
                ))}
            </View>
          )}

          <View style={styles.transfersSectionContainerHeader}>
            <Text style={styles.transfersSectionContainerTitle}>
              {translate.t('tabNavigation.payments')}
            </Text>
            {route.params.account.type !== PACKET_TYPE_IDS.unicard && (
              <PaginationDots step={paymentSectionStep} length={2} />
            )}
          </View>

          <ScrollView
            ref={carouselRef}
            onScroll={({nativeEvent}) =>
              onChangePaymentSectionStep(nativeEvent)
            }
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            scrollEnabled={
              route.params.account.type !== PACKET_TYPE_IDS.unicard
            }
            horizontal>
            {/* <Payments exclude={true} selectdeAccount={selectedFromAccount} /> */}
            <View style={[screenStyles.wraper, styles.toolItemsWraper]}>
              <View style={[styles.sectionContainerColumn, {width: cardWidth}]}>
                <TouchableOpacity
                  style={styles.sectionContainerItem}
                  onPress={() => {
                    getCategories(
                      1,
                      false,
                      false,
                      true,
                      true,
                      translate.t('services.utility'),
                      true,
                    );
                  }}>
                  <View style={styles.sectionContainerItemImageContainer}>
                    <Image
                      source={{uri: `${envs.CDN_PATH}utility/home.png`}}
                      style={styles.toolsIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.sectionContainerItemDetails}>
                    {breackWords(translate.t('services.utility'))}
                  </View>
                </TouchableOpacity>

                {route.params.account.type !== PACKET_TYPE_IDS.unicard && (
                  <>
                    <TouchableOpacity
                      style={styles.sectionContainerItem}
                      onPress={() => {
                        getCategories(
                          9,
                          false,
                          false,
                          true,
                          true,
                          translate.t('services.tvInternet'),
                          false,
                        );
                      }}>
                      <View style={styles.sectionContainerItemImageContainer}>
                        <Image
                          source={{uri: `${envs.CDN_PATH}utility/internet.png`}}
                          style={[styles.toolsIcon, isDisabled]}
                          resizeMode="contain"
                        />
                      </View>
                      <View
                        style={[
                          styles.sectionContainerItemDetails,
                          isDisabled,
                        ]}>
                        {breackWords(translate.t('services.tvInternet'))}
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.sectionContainerItem}
                      onPress={() => {
                        getCategories(
                          10,
                          false,
                          false,
                          true,
                          true,
                          translate.t('services.telephone'),
                          false,
                        );
                      }}>
                      <View style={styles.sectionContainerItemImageContainer}>
                        <Image
                          source={{uri: `${envs.CDN_PATH}utility/phone.png`}}
                          style={[styles.toolsIcon, isDisabled]}
                          resizeMode="contain"
                        />
                      </View>
                      <View
                        style={[
                          styles.sectionContainerItemDetails,
                          isDisabled,
                        ]}>
                        {breackWords(translate.t('services.telephone'))}
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <View style={[styles.sectionContainerColumn, {width: cardWidth}]}>
                {route.params.account.type !== PACKET_TYPE_IDS.unicard && (
                  <>
                    <TouchableOpacity
                      style={styles.sectionContainerItem}
                      onPress={() => {
                        getCategories(
                          7,
                          false,
                          false,
                          true,
                          true,
                          translate.t('services.mobile'),
                          true,
                        );
                      }}>
                      <View style={styles.sectionContainerItemImageContainer}>
                        <Image
                          source={{uri: `${envs.CDN_PATH}utility/mobile.png`}}
                          style={styles.toolsIcon}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={styles.sectionContainerItemDetails}>
                        {breackWords(translate.t('services.mobile'))}
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.sectionContainerItem}
                      onPress={() => {
                        getCategories(
                          14,
                          false,
                          false,
                          true,
                          true,
                          translate.t('services.parking'),
                          false,
                        );
                      }}>
                      <View style={styles.sectionContainerItemImageContainer}>
                        <Image
                          source={{uri: `${envs.CDN_PATH}utility/parking.png`}}
                          style={[styles.toolsIcon, isDisabled]}
                          resizeMode="contain"
                        />
                      </View>
                      <View
                        style={[
                          styles.sectionContainerItemDetails,
                          isDisabled,
                        ]}>
                        {breackWords(translate.t('services.parking'))}
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.sectionContainerItem}
                      onPress={() => {
                        getCategories(
                          8,
                          false,
                          false,
                          true,
                          true,
                          translate.t('services.gambling'),
                          false,
                        );
                      }}>
                      <View style={styles.sectionContainerItemImageContainer}>
                        <Image
                          source={{uri: `${envs.CDN_PATH}utility/game.png`}}
                          style={[styles.toolsIcon, isDisabled]}
                          resizeMode="contain"
                        />
                      </View>
                      <View
                        style={[
                          styles.sectionContainerItemDetails,
                          isDisabled,
                        ]}>
                        {breackWords(translate.t('services.gambling'))}
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </ScrollView>

          {route.params.account.type !== PACKET_TYPE_IDS.unicard && (
            <>
              <View style={styles.line}></View>
              <View style={styles.transfersSectionContainerHeader}>
                <Text style={styles.transfersSectionContainerTitle}>
                  {translate.t('tabNavigation.transfers')}
                </Text>
                <PaginationDots step={transferSectionStep} length={2} />
              </View>
            </>
          )}

          {route.params.account.type !== PACKET_TYPE_IDS.unicard && (
            <ScrollView
              ref={carouselRef}
              onScroll={({nativeEvent}) =>
                onChangeTransferSectionStep(nativeEvent)
              }
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              horizontal>
              <View style={[styles.transferItemsWraper, screenStyles.wraper]}>
                <View
                  style={[
                    styles.transfersSectionContainerColumn,
                    {width: cardWidth},
                  ]}>
                  <TouchableOpacity
                    style={styles.transfersSectionContainerItemScroller}
                    onPress={transferBetweenAccounts}>
                    <View
                      style={
                        styles.transfersSectionContainerItemImageContainer
                      }>
                      <Image
                        source={require('./../../../assets/images/between_accounts.png')}
                        style={[
                          styles.transfersSectionContainerItemImage,
                          isDisabled,
                        ]}
                      />
                    </View>
                    <View
                      style={[
                        styles.transfersSectionContainerItemDetails,
                        isDisabled,
                      ]}>
                      {breackWords(translate.t('transfer.betweeenOwnAccounts'))}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.transfersSectionContainerItemScroller}
                    onPress={transferToUni}>
                    <View
                      style={
                        styles.transfersSectionContainerItemImageContainer
                      }>
                      <Image
                        source={require('./../../../assets/images/to_wallet.png')}
                        style={[
                          styles.transfersSectionContainerItemImage,
                          isDisabled,
                        ]}
                      />
                    </View>
                    <View
                      style={[
                        styles.transfersSectionContainerItemDetails,
                        isDisabled,
                      ]}>
                      {breackWords(translate.t('transfer.toUniWallet'))}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.transfersSectionContainerItemScroller}
                    onPress={transferConvertation}>
                    <View
                      style={
                        styles.transfersSectionContainerItemImageContainer
                      }>
                      <Image
                        source={require('./../../../assets/images/convertation.png')}
                        style={[
                          styles.transfersSectionContainerItemImage,
                          isDisabled,
                        ]}
                      />
                    </View>
                    <View
                      style={[
                        styles.transfersSectionContainerItemDetails,
                        isDisabled,
                      ]}>
                      {breackWords(translate.t('transfer.currencyExchange'))}
                    </View>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.transfersSectionContainerColumn,
                    {width: cardWidth},
                  ]}>
                  <TouchableOpacity
                    style={styles.transfersSectionContainerItemScroller}
                    onPress={transferToBank}>
                    <View
                      style={
                        styles.transfersSectionContainerItemImageContainer
                      }>
                      <Image
                        source={require('./../../../assets/images/to_bank.png')}
                        style={[
                          styles.transfersSectionContainerItemImage,
                          isDisabled,
                        ]}
                      />
                    </View>
                    <View
                      style={[
                        styles.transfersSectionContainerItemDetails,
                        isDisabled,
                      ]}>
                      {breackWords(translate.t('transfer.toBank'))}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}

          {route.params.account.type !== PACKET_TYPE_IDS.unicard && (
            <>
              <View style={styles.line}></View>
              <View style={styles.transfersSectionContainerHeader}>
                <Text style={styles.transfersSectionContainerTitle}>
                  {translate.t('products.manageCard')}
                </Text>
              </View>
            </>
          )}

          {route.params.account.type !== PACKET_TYPE_IDS.unicard && (
            <View style={[screenStyles.wraper, styles.toolItemsWraper]}>
              <View style={[styles.sectionContainerColumn, {width: cardWidth}]}>
                {route.params.account.type !== PACKET_TYPE_IDS.wallet && (
                  <TouchableOpacity
                    style={styles.sectionContainerItem}
                    onPress={startCardBlock}>
                    <View style={styles.sectionContainerItemImageContainer}>
                      <Image
                        source={require('./../../../assets/images/block-icon.png')}
                        style={styles.toolsIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.sectionContainerItemDetails}>
                      {breackWords(translate.t('products.blockCard'))}
                    </View>
                  </TouchableOpacity>
                )}

                {route.params.account.type !== PACKET_TYPE_IDS.wallet && (
                  <TouchableOpacity
                    style={styles.sectionContainerItem}
                    onPress={startPinChange}>
                    <View style={styles.sectionContainerItemImageContainer}>
                      <Image
                        source={require('./../../../assets/images/pin-icon.png')}
                        style={styles.toolsIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.sectionContainerItemDetails}>
                      {breackWords(translate.t('products.changeCardPin'))}
                    </View>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.sectionContainerItem}
                  onPress={startAccountTopup}>
                  <View style={styles.sectionContainerItemImageContainer}>
                    <Image
                      source={require('./../../../assets/images/plus_noBG.png')}
                      style={styles.toolsIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.sectionContainerItemDetails}>
                    {breackWords(translate.t('plusSign.topUp'))}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {route.params.account.type !== PACKET_TYPE_IDS.wallet &&
          route.params.account.type !== PACKET_TYPE_IDS.unicard && (
            <>
              <View style={styles.line}></View>
              <View style={[screenStyles.wraper, styles.swiths]}>
                <Text style={styles.checkTitle}>
                  {translate.t('orderCard.highRiskMerchantTitle')}
                </Text>

                <View style={styles.toggleBox}>
                  <Switch
                    style={styles.check}
                    trackColor={{
                      false: colors.inputBackGround,
                      true: colors.primary,
                    }}
                    thumbColor={isEnabled ? colors.white : colors.white}
                    ios_backgroundColor={colors.inputBackGround}
                    onValueChange={toggleHrmSwitch}
                    value={isEnabled}
                  />
                  <Text style={styles.checkLabel}>
                    {translate.t('orderCard.riskLevel_a1')}
                  </Text>
                </View>

                <View style={styles.toggleBox}>
                  <Switch
                    style={styles.check}
                    trackColor={{
                      false: colors.inputBackGround,
                      true: colors.primary,
                    }}
                    thumbColor={isEnabled2 ? colors.white : colors.white}
                    ios_backgroundColor={colors.inputBackGround}
                    onValueChange={toggleHrmSwitch2}
                    value={isEnabled2}
                  />
                  <Text style={styles.checkLabel}>
                    {translate.t('orderCard.riskLevel_a2')}
                  </Text>
                </View>
              </View>
            </>
          )}
        <View style={styles.line}></View>
        <View style={[screenStyles.wraper, styles.transactions]}>
          <TransactionsList hideSeeMoreButton={true} statements={[...(userData.useAccountStatements?.statements || [])]} />
        </View>
      </ReactScroll>
      <ActionSheetCustom
        scrollable={true}
        hasDraggableIcon={true}
        visible={actionSheetType == CARD_ACTIONS.card_block}
        hasScroll={false}
        height={actionSheetHeight}
        onPress={closeActionSheet}>
        <View style={styles.blockContainer}>
          <Text style={styles.actionSheetTitle}>{actionSheetTitle}</Text>

          <Image
            source={
              actionSheetStatus === ACTION_SHEET_STATUSES.start
                ? require('./../../../assets/images/info_orange.png')
                : actionSheetStatus === ACTION_SHEET_STATUSES.succes
                ? require('./../../../assets/images/info_green.png')
                : require('./../../../assets/images/info_red.png')
            }
            style={styles.actionLogo}
          />

          <View style={styles.actionButtons}>
            {actionSheetStatus === ACTION_SHEET_STATUSES.start && (
              <AppButton
                title={translate.t('common.block')}
                onPress={cardBlock}
                backgroundColor={colors.danger}
                style={styles.actionButton}
                isLoading={actionLoading}
              />
            )}
            <AppButton
              title={`${
                actionSheetStatus === ACTION_SHEET_STATUSES.start
                  ? translate.t('common.no')
                  : translate.t('common.close')
              }`}
              onPress={closeActionSheet}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ActionSheetCustom>

      <ActionSheetCustom
        scrollable={true}
        hasDraggableIcon={true}
        visible={actionSheetType == CARD_ACTIONS.change_pin}
        hasScroll={false}
        height={actionSheetHeight}
        onPress={closeActionSheet}>
        <View style={styles.blockContainer}>
          {actionSheetStatus === ACTION_SHEET_STATUSES.otp ? (
            <View style={styles.otpHeader}>
              <Text style={styles.otpTitle}>{translate.t('otp.otpSent')}: </Text>
              <Text style={styles.otpVewPhone}>{maskedPhoneNumber}</Text>
            </View>
          ) : (
            <Text style={styles.actionSheetTitle}>{actionSheetTitle}</Text>
          )}
          {actionSheetStatus === ACTION_SHEET_STATUSES.start && (
            <>
              <View style={styles.descContainer}>
                <Text style={styles.description}>
                  {translate.t('products.wilResavePinCode')}
                </Text>
              </View>
              <Text style={styles.blockCardMask}>
                {route.params.account.accountTypeName}{' '}
                {route.params.account?.cards &&
                  route.params.account?.cards[currentCardIndex]
                    ?.maskedCardNumber}
              </Text>
            </>
          )}

          {actionSheetStatus === ACTION_SHEET_STATUSES.otp && (
            <View>
              <FloatingLabelInput
                Style={styles.otpBox}
                label={translate.t('otp.smsCode')}
                title=""
                value={otp}
                onChangeText={setOtp}
                onRetry={SendPhoneOTP}
              />
            </View>
          )}

          {actionSheetStatus === ACTION_SHEET_STATUSES.succes && (
            <Image
              source={require('./../../../assets/images/info_green.png')}
              style={styles.actionLogo}
            />
          )}

          {actionSheetStatus === ACTION_SHEET_STATUSES.error && (
            <Image
              source={require('./../../../assets/images/info_red.png')}
              style={styles.actionLogo}
            />
          )}

          <View style={styles.actionButtons}>
            <AppButton
              title={`${
                actionSheetStatus === ACTION_SHEET_STATUSES.start
                  ? translate.t('common.confirm')
                  : actionSheetStatus === ACTION_SHEET_STATUSES.otp
                  ? translate.t('common.next')
                  : translate.t('common.close')
              }`}
              onPress={pinChangeActions}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ActionSheetCustom>
      <Modal
        visible={isHrmProcessing}
        onRequestClose={setIsHrmProcessing.bind(this, false)}
        animationType="slide">
        <View style={styles.otpContent}>
          <FloatingLabelInput
            Style={styles.otpBox2}
            label={translate.t('otp.smsCode')}
            resendTitle={translate.t('otp.resend')}
            title=""
            value={otp}
            onChangeText={setOtp}
            onRetry={SendPhoneOTP}
          />

          <AppButton
            title={translate.t('common.next')}
            onPress={changeConditionRisklevelUFC}
            style={styles.otpButton}
            isLoading={hrmLoading}
          />
        </View>
      </Modal>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: colors.white},
  cards: {
    marginTop: 32,
  },
  transactionContainer: {
    marginBottom: 41,
  },
  transferItemsWraper: {
    flexDirection: 'row',
  },
  transfersSectionContainer: {
    flex: 1,
    marginTop: 33,
    backgroundColor: colors.white,
  },
  transfersSectionContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 18,
    paddingHorizontal: 22,
    marginBottom: 14,
    marginTop: 20,
    backgroundColor: colors.white,
  },
  transfersSectionContainerTitle: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  transfersSectionContainerColumn: {
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  transfersSectionContainerItem: {
    overflow: 'hidden',
    alignItems: 'center',
    width: '33.3333333333%',
  },
  transfersSectionContainerItemImageContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    elevation: 2,
    shadowColor: '#00000060',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: Platform.OS === 'ios' ? 5 : 25,
    borderRadius: 25,
    backgroundColor: colors.white,
  },
  transfersSectionContainerItemImage: {
    width: 40,
    height: 40,
  },
  transfersSectionContainerItemDetails: {
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  sectionContainerItemDetailsTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 12,
    lineHeight: 15,
    color: colors.black,
    textAlign: 'center',
  },
  toolsIcon: {
    width: 20,
    height: 20,
  },
  toolItemsWraper: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: colors.white,
  },
  sectionContainerColumn: {
    flexDirection: 'row',
  },
  sectionContainerItem: {
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
    alignItems: 'center',
    width: '33.3333333333%',
  },
  sectionContainerItemImageContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    elevation: 2,
    shadowColor: '#00000060',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: Platform.OS === 'ios' ? 5 : 25,
    borderRadius: 25,
    backgroundColor: colors.white,
  },
  sectionContainerItemDetails: {
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  transactions: {
    marginTop: 0,
    backgroundColor: colors.white,
  },
  blockContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  actionSheetTitle: {
    color: colors.black,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'FiraGO-Bold',
    textAlign: 'center',
    marginTop: 30,
  },
  actionLogo: {
    alignSelf: 'center',
    marginTop: 50,
  },
  actionButtons: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  actionButton: {
    width: 140,
  },
  description: {
    color: colors.labelColor,
    fontSize: 14,
    lineHeight: 17,
    fontFamily: 'FiraGO-Regular',
    textAlign: 'center',
    marginTop: 35,
  },
  descContainer: {
    maxWidth: 299,
    alignSelf: 'center',
  },
  blockCardMask: {
    color: colors.black,
    fontSize: 14,
    lineHeight: 17,
    fontFamily: 'FiraGO-Bold',
    textAlign: 'center',
    marginTop: 30,
  },
  otpHeader: {
    marginTop: 30,
  },
  otpTitle: {
    color: colors.black,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'FiraGO-Bold',
    textAlign: 'center',
  },
  otpVewPhone: {
    color: colors.labelColor,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'FiraGO-Bold',
    textAlign: 'center',
    marginTop: 5,
  },
  otpBox: {},
  transfersSectionContainerItemScroller: {
    overflow: 'hidden',
    alignItems: 'center',
    width: '33.3333333333%',
  },
  barCode: {
    height: 65,
    width: '100%',
  },
  loadingBox: {
    alignSelf: 'center',
    flex: 1,
    marginTop: 10,
  },
  line: {
    backgroundColor: colors.inputBackGround,
    height: 1,
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 30,
  },
  checkTitle: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    marginTop: 35,
  },
  toggleBox: {
    flexShrink: 1,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  check: {
    alignSelf: 'flex-start',
  },
  checkLabel: {
    fontFamily: 'FiraGO-Book',
    fontSize: 10,
    lineHeight: 12,
    color: colors.black,
    marginLeft: 18,
    flex: 1,
    flexWrap: 'wrap',
  },
  swiths: {
    backgroundColor: colors.white,
    marginBottom: 30,
  },
  otpContent: {
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 30,
  },
  otpButton: {
    marginBottom: tabHeight + 40,
  },
  otpBox2: {
    top: Dimensions.get('window').height / 4,
  },
});

export default ProductDetail;
