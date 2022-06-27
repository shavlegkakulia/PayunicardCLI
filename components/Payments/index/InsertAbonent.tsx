import React, {useEffect, useRef} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {TYPE_UNICARD} from '../../../constants/accountTypes';
import colors from '../../../constants/colors';
import {GEL} from '../../../constants/currencies';
import FetchUserAccounts from '../../../hooks/getAccounBalances';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import NetworkService from '../../../services/NetworkService';
import {
  IGetPaymentDetailsRequest,
  IGetPaymentDetailsResponseData,
} from '../../../services/PresentationServive';
import TransactionService, {
  IGetDeptRequest,
  IRegisterPayTransactionRequest,
  IRegisterPayTransactionResponse,
  ISendUnicardOtpRequest,
  IStructure,
} from '../../../services/TransactionService';
import {
  IAccountBallance,
} from '../../../services/UserService';
import {
  CurrencySimbolConverter,
  getNumber,
  getString,
} from '../../../utils/Converter';
import OtpModal from '../../OtpModal';
import AppButton from '../../UI/AppButton';
import AppInput from '../../UI/AppInput';
import {AccountItem} from '../../UI/Select/AccountItem';
import Select from '../../UI/Select/Select';
import Validation, {hasNumeric, required} from '../../UI/Validation';
import {EPaymentStep, IPaymentStates} from '../CategoryContainer';
import AmountInfo, {IAmountInfo} from './commons/AmountInfo';
import PaymentInfo, {IPaymentInfoDetails} from './commons/PaymentInfo';

export interface IPayemntCDetails {
  getState: React.Dispatch<Partial<IPaymentStates>>;
  OnGetPaymentDetails?: (
    data: IGetPaymentDetailsRequest,
    step?: EPaymentStep,
  ) => void;
  serviceName?: string;
  abonentCode?: string;
  carPlate?: string;
  debtData?: IStructure[];
  categoryID?: number;
  serviceLogoUrl?: string;
  step: EPaymentStep;
  amount?: string;
  account?: IAccountBallance;
  paymentDetail?: IGetPaymentDetailsResponseData;
  otp?: string;
  otpVisible?: boolean;
  unicardOtpGuid?: string;
  fetchingSomethingData?: boolean;
  transactionData?: IRegisterPayTransactionResponse;
  createPayTemplate?: boolean;
  imageUrl?: string;
}

const mobileNetworkMerchantCategoryIds: Array<number | undefined> = [
  7, 33, 17, 8,
];

interface IPageProps extends IPayemntCDetails {}

const context = 'newPayment';

const InsertAbonent: React.FC<IPageProps> = props => {
  const {
    getState,
    OnGetPaymentDetails,
    step,
    serviceName,
    amount,
    account,
    abonentCode,
    carPlate,
    debtData,
    categoryID,
    serviceLogoUrl,
    paymentDetail,
    otp,
    otpVisible,
    unicardOtpGuid,
    fetchingSomethingData,
    createPayTemplate,
    imageUrl,
  } = props;
  const {
    forOpClassCode,
    forMerchantServiceCode,
    merchantServiceCode,
    forPaySpCode,
    forPaySPCode,
    forMerchantCode,
    debtCode,
    amountFee,
    minAmount,
    maxAmount,
  } = paymentDetail || {};
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const callTimeote = useRef<NodeJS.Timeout>();
  const isArmy = forMerchantCode === 'PATRJAR';

  const CheckDebt = () => {
    //for mobile merchants not allowed checkdebt
    if (!mobileNetworkMerchantCategoryIds.includes(categoryID)) {
      let AbonentCode = abonentCode;
      if (isArmy) {
        AbonentCode += '/' + carPlate;
      }

      const data: IGetDeptRequest = {
        forPaySPCode: forPaySpCode || forPaySPCode,
        forMerchantCode: forMerchantCode,
        forMerchantServiceCode: forMerchantServiceCode || merchantServiceCode,
        serviceId: debtCode,
        abonentCode: AbonentCode,
      };
   
      TransactionService.checkCostumerDebt(data).subscribe({
        next: Response => {
          if (Response.data.Ok) {
            const structs = Response.data.Data?.Structures;
            const inValue = structs?.filter(debt => debt.FieldCode === 'Debt' ||
            debt.FieldCode === 'FineAmount' ||
            debt.FieldCode === 'TotalDebt' ||
            debt.FieldCode === 'Balance');
            let inAmount: string | undefined = undefined;
            if(inValue !== undefined && inValue.length) {
                inAmount = Math.abs(getNumber(inValue[0].Value)).toString();
            }
            getState({debtData: structs, amount: inAmount});
          }
        },
        complete: () => {
          getState({paymentStep: EPaymentStep.InsertAmount});
        },
        error: e => {
          console.log(e);
        },
      });
    } else {
      getState({paymentStep: EPaymentStep.InsertAmount});
    }
  };

  const goNext = () => {
    if (Validation.validate(context)) {
      return;
    }
    if (step === EPaymentStep.InsertAbonent) {
      CheckDebt();
    } else if (step === EPaymentStep.InsertAmount && !createPayTemplate) {
      if (
        account !== undefined &&
        account.type === TYPE_UNICARD &&
        !unicardOtpGuid
      ) {
        SendUnicardOTP();
      } else {
        startPay();
      }
    } else {
        getState({paymentStep: EPaymentStep.PaymentSucces});
    }
  };

  const startPay = () => {
    if (fetchingSomethingData) {
      return;
    }
    getState({fetchingSomethingData: true});
    let params: IRegisterPayTransactionRequest = {};
    if (otp && unicardOtpGuid) {
      params.unicard = account?.accountId;
      params.AccountId = null;
      params.forFundsSPCode = 'UNICARD';
      params.unicardOtpGuid = unicardOtpGuid;
      params.unicardOtp = otp;
    }

    let _abonentCode = abonentCode;
    if (isArmy) {
      _abonentCode = _abonentCode + '/' + carPlate;
    }

    const data: IRegisterPayTransactionRequest = {
      forOpClassCode: forOpClassCode,
      forFundsSPCode: 'UniWallet',
      forMerchantCode: forMerchantCode,
      forMerchantServiceCode: forMerchantServiceCode || merchantServiceCode,
      AccountId: account?.accountId?.toString(),
      amount: amount,
      serviceId: debtCode,
      abonentCode: _abonentCode,
      forPaySPCode: forPaySpCode || forPaySPCode,
      ...params,
    };

    TransactionService.startPaymentTransaction(data).subscribe({
      next: Response => {
        if (Response.data.ok) {
          getState({
            transactionData: Response.data?.data,
            fetchingSomethingData: false,
            paymentStep: EPaymentStep.PaymentSucces,
          });
        }
      },
      error: () => {
        getState({fetchingSomethingData: false});
      },
    });
  };

  const SendUnicardOTP = () => {
    getState({otpVisible: true, fetchingSomethingData: true});
    NetworkService.CheckConnection(() => {
      let OTP: ISendUnicardOtpRequest = {
        card: account?.accountNumber,
      };

      TransactionService.UnicardOtp(OTP).subscribe({
        next: Response => {
          if (Response.data.ok) {
            getState({unicardOtpGuid: Response.data.data?.otpGuid});
          }
        },
        error: () => {
          getState({fetchingSomethingData: false});
        },
        complete: () => {
          getState({fetchingSomethingData: false});
        },
      });
    });
  };

  const getDetail = () => {
    if (callTimeote.current) clearTimeout(callTimeote.current);
    callTimeote.current = setTimeout(() => {
      const paymentDetailrequestData: IGetPaymentDetailsRequest = {
        ForOpClassCode: forOpClassCode,
        ForFundsSPCode: 'UniWallet',
        ForMerchantCode: forMerchantCode,
        ForMerchantServiceCode: forMerchantServiceCode || merchantServiceCode,
        AccountNumber: account?.accountNumber,
        InAmount: getNumber(amount),
        ForCustomerType: getString(account?.customerAccountType?.toString()),
      };
      OnGetPaymentDetails?.(
        paymentDetailrequestData,
        EPaymentStep.InsertAmount,
      );
    }, 1500);
  };

  useEffect(() => {
    if (
      amount &&
      account?.accountNumber &&
      step === EPaymentStep.InsertAmount
    ) {
      getDetail();
    }
  }, [amount, account?.accountNumber]);

  let _abonent: string | undefined = abonentCode;
  if (abonentCode) {
    if (isArmy && carPlate) {
      _abonent = `${abonentCode}/${carPlate}`;
    } else if (isArmy && !carPlate) {
      _abonent = `${abonentCode}`;
    }
  } else {
    if (isArmy && carPlate) {
      _abonent = `${carPlate}`;
    } else if (isArmy && !carPlate) {
      _abonent = undefined;
    }
  }

  const paymentInfoDetil: IPaymentInfoDetails = {
    serviceName: serviceName,
    serviceLogoUrl: serviceLogoUrl || imageUrl,
    abonentCode: _abonent,
  };
  if (debtData) {
    debtData?.forEach(data => {
      if (
        data.FieldCode === 'Debt' ||
        data.FieldCode === 'FineAmount' ||
        data.FieldCode === 'TotalDebt' ||
        data.FieldCode === 'Balance'
      ) {
        paymentInfoDetil.debt = `${data.Value}${data.CCY}`;
      } else if (
        data.FieldCode === 'AbonentName' ||
        data.FieldCode === 'NameAndSurname' ||
        data.FieldCode === 'Name' ||
        data.FieldCode === 'UserName'
      ) {
        paymentInfoDetil.abonentName = `${data.Value}`;
      } else if (
        data.FieldCode === 'AbonentAddress' ||
        data.FieldCode === 'Region'
      ) {
        paymentInfoDetil.address = `${data.Value}`;
      }
    });
  }

  const amountInfo: IAmountInfo = {
    commision: amountFee,
    totalAmount: paymentDetail?.amount,
    minAmount: minAmount,
    maxAmount: maxAmount,
    ccy: CurrencySimbolConverter(GEL),
  };

  const {accounts, loading, error} = FetchUserAccounts();
  let allowedAccounts: IAccountBallance[] | undefined =
    accounts?.accountBallances;

  if (paymentDetail?.canPayWithUnipoints === 0) {
    allowedAccounts = accounts?.accountBallances?.filter(
      acc => acc.type !== TYPE_UNICARD,
    );
  }

  if (categoryID === 8) {
    allowedAccounts = accounts?.accountBallances?.filter(
      acc =>
        acc.type !== TYPE_UNICARD &&
        acc.customerPaketId !== 2 &&
        acc.type !== 0,
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}>
          <View style={styles.content}>
            <View>
              <PaymentInfo {...paymentInfoDetil} />
              <View style={styles.form}>
                {step === EPaymentStep.InsertAbonent ? (
                  <View style={[styles.input, isArmy ? styles.row : {}]}>
                    <View>
                      <Text style={styles.inputLabel}>
                        {isArmy ? 'ქვითრის სერია' : 'აბონენტის ნომერი'}
                      </Text>
                      <AppInput
                        placeholder="- - -"
                        value={abonentCode}
                        onChange={value => getState({abonentCode: value})}
                        customKey="abonentCode"
                        context={context}
                        requireds={[required]}
                        style={[isArmy ? styles.duplicateInput : {}]}
                      />
                    </View>
                    {isArmy ? (
                      <View>
                        <Text style={styles.inputLabel}>მანქანის ნომერი</Text>
                        <AppInput
                          placeholder="- - -"
                          value={carPlate}
                          onChange={value => getState({carPlate: value})}
                          customKey="carPlate"
                          context={context}
                          requireds={[required]}
                          style={styles.duplicateInput}
                        />
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {step > EPaymentStep.InsertAbonent ? (
                  <>
                    <View style={styles.input}>
                      <Text style={styles.inputLabel}>აირჩიეთ ანგარიში</Text>
                      <Select<IAccountBallance>
                        Item={i => (
                          <AccountItem
                            {...i}
                            style={styles.accountItem}
                            placeholder={'არჩევა'}
                          />
                        )}
                        onChange={value => {
                          getState({account: value});
                        }}
                        values={allowedAccounts}
                        value={account}
                        activeItemStyle={styles.currentAccountItem}
                        requireds={[required]}
                        customKey={'accountNumber'}
                        context={context}
                      />
                    </View>
                    <View style={styles.input}>
                      <Text style={styles.inputLabel}>თანხა</Text>
                      <AppInput
                        placeholder="0.0"
                        value={amount}
                        onChange={value => getState({amount: value})}
                        customKey="amount"
                        context={context}
                        keyboardType={'decimal-pad'}
                        requireds={[required, hasNumeric]}
                      />
                    </View>
                  </>
                ) : null}
              </View>
            </View>
            <View>
              {step > EPaymentStep.InsertAbonent ? (
                amountFee !== undefined && amountFee !== null ? (
                  <View>
                    <AmountInfo {...amountInfo} />
                  </View>
                ) : null
              ) : null}
              <AppButton
                isLoading={fetchingSomethingData}
                title="შემდეგი"
                onPress={goNext}
                style={styles.button}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <OtpModal
        modalVisible={otpVisible}
        otp={otp}
        onSetOtp={value => getState({otp: value})}
        onSendOTP={SendUnicardOTP}
        onComplate={goNext}
        isLoading={fetchingSomethingData}
        label={translate.t('otp.smsCode')}
        buttonText={translate.t('common.next')}
        onClose={() => {
          getState({otp: undefined, otpVisible: false});
        }}
      />
    </>
  );
};

export default React.memo(InsertAbonent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 17,
    paddingTop: 20,
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    marginTop: 40,
  },
  inputLabel: {
    marginBottom: 17,
  },
  input: {
    marginBottom: 20,
  },
  duplicateInput: {
    width: (Dimensions.get('window').width - 34) / 2 - 20,
  },
  button: {
    marginTop: 15,
    marginBottom: 50,
  },
  accountItem: {
    borderRadius: 7,
  },
  currentAccountItem: {
    borderRadius: 7,
    backgroundColor: colors.baseBackgroundColor,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
  },
});
