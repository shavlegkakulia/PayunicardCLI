import {RouteProp, useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AccountSelect, {
  AccountItem,
} from '../../../../components/AccountSelect/AccountSelect';
import AppButton from '../../../../components/UI/AppButton';
import AppInput from '../../../../components/UI/AppInput';
import Validation, {
  hasNumeric,
  required,
} from '../../../../components/UI/Validation';
import {TYPE_UNICARD} from '../../../../constants/accountTypes';
import colors from '../../../../constants/colors';
import {GEL} from '../../../../constants/currencies';
import Routes from '../../../../navigation/routes';
import {tabHeight} from '../../../../navigation/TabNav';
import {PUSH} from '../../../../redux/actions/error_action';
import {
  addPayTemplate,
  GetPaymentDetails,
  onCheckDebt,
  startPaymentTransaction,
} from '../../../../redux/actions/payments_actions';
import {
  IGlobalPaymentState,
  IPaymentState,
  PAYMENTS_ACTIONS,
} from '../../../../redux/action_types/payments_action_type';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../../redux/action_types/user_action_types';
import NavigationService from '../../../../services/NavigationService';
import NetworkService from '../../../../services/NetworkService';
import TransactionService, {
  ISendUnicardOtpRequest,
} from '../../../../services/TransactionService';
import {IAccountBallance} from '../../../../services/UserService';
import screenStyles from '../../../../styles/screens';
import {
  CurrencyConverter,
  CurrencySimbolConverter,
  getNumber,
  getString,
} from '../../../../utils/Converter';
import {INavigationProps} from '../../transfers';
import SetOtp from './SetOtp';

type RouteParamList = {
  params: {
    paymentStep: string;
    step: number;
    currentAccount: IAccountBallance | undefined;
    withTemplate: boolean;
  };
};

const ValidationContext = 'payment3';

const InsertAccointAndAmount: React.FC<INavigationProps> = props => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountVisible, setAccountVisible] = useState<boolean>(false);
  const [otpVisible, setOtpVisible] = useState<boolean>(false);
  const [otp, setOtp] = useState<string | undefined>();
  const [unicardOtpGuid, setUnicardOtpGuid] = useState<string | undefined>();
  const [_accounts, setAccounts] = useState<IAccountBallance[] | undefined>();
  const [accountErrorStyle, setAccountErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const PaymentStore = useSelector<IGlobalPaymentState>(
    state => state.PaymentsReducer,
  ) as IPaymentState;
  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const dispatch = useDispatch();
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();

  const next = () => {
    if (!PaymentStore.selectedAccount) {
      setAccountErrorStyle({borderColor: colors.danger, borderWidth: 1});
      return;
    }

    if (Validation.validate(ValidationContext)) return;

    if (
      getNumber(PaymentStore.amount) <
      getNumber(PaymentStore.paymentDetails?.minAmount)
    ) {
      dispatch(
        PUSH(
          `მინიმალური გადასახდელი თანხა შეადგენს ${
            PaymentStore.paymentDetails?.minAmount
          }${CurrencySimbolConverter(GEL)}`,
        ),
      );
      setIsLoading(false);
      return;
    }

    if (
      getNumber(PaymentStore.amount) >
      getNumber(PaymentStore.paymentDetails?.maxAmount)
    ) {
      dispatch(
        PUSH(
          `მაქსიმალური გადასახდელი თანხა შეადგენს ${
            PaymentStore.paymentDetails?.maxAmount
          }${CurrencySimbolConverter(GEL)}`,
        ),
      );
      setIsLoading(false);
      return;
    }

    if (
      PaymentStore.selectedAccount?.type === TYPE_UNICARD &&
      (!otp || !unicardOtpGuid) &&
      !route.params.withTemplate
    ) {
      SendUnicardOTP();
      setOtpVisible(true);
      setIsLoading(false);
      return;
    }

    if (route.params.withTemplate) {
      dispatch(
        addPayTemplate(
          {
            templName: _serviceName,
            forOpClassCode: 'P2B',
            abonentCode: PaymentStore.abonentCode,
            amount: getNumber(PaymentStore.amount),
            externalAccountId: PaymentStore.selectedAccount.accountId,
            merchantServiceID: PaymentStore.paymentDetails?.merchantId,
          },
          status => {
            if (status) {
              NavigationService.navigate(Routes.Payments_SUCCES, {
                withTemplate: route.params.withTemplate,
              });
            }
          },
        ),
      );
      return;
    }
    startPay();
  };
 
  const onAccountSelect = (account: IAccountBallance) => {
    dispatch({
      type: PAYMENTS_ACTIONS.PAYMENT_SET_SELECTED_ACCOUNT,
      selectedAccount: account,
    });
    setAccountVisible(!accountVisible);
  };

  const onSetAmount = (amount: string) => {
    dispatch({type: PAYMENTS_ACTIONS.PAYMENT_SET_AMOUNT, amount: amount});
  };

  const startPay = () => {
    let params: any = {};
    if (otp && unicardOtpGuid) {
      params.unicard = PaymentStore.selectedAccount?.accountId;
      params.AccountId = null;
      params.forFundsSPCode = 'UNICARD';
      params.unicardOtpGuid = unicardOtpGuid;
      params.unicardOtp = otp;
    }
    6841377;

    let _abonentCode = PaymentStore.abonentCode;
    if (PaymentStore.carPlate) {
      _abonentCode = _abonentCode + '/' + PaymentStore.carPlate;
    }

    dispatch(
      startPaymentTransaction(
        {
          forOpClassCode: PaymentStore.currentService?.forOpClassCode,
          forFundsSPCode: 'UniWallet',
          forMerchantCode: PaymentStore.currentService?.merchantCode,
          forMerchantServiceCode:
            PaymentStore.currentService?.merchantServiceCode,
          AccountId: PaymentStore.selectedAccount?.accountId?.toString(),
          amount: PaymentStore.amount,
          serviceId: PaymentStore.paymentDetails?.debtCode,
          abonentCode: _abonentCode,
          forPaySPCode:
            PaymentStore.paymentDetails?.forPaySPCode ||
            PaymentStore.paymentDetails?.forPaySpCode,
          ...params,
        },
        status => {
          if (status) {
            NavigationService.navigate(Routes.Payments_SUCCES);
          }
        },
      ),
    );
  };

  const SendUnicardOTP = () => {
    NetworkService.CheckConnection(() => {
      setIsLoading(true);
      let OTP: ISendUnicardOtpRequest = {
        card: PaymentStore.selectedAccount?.accountNumber,
      };
     
      TransactionService.UnicardOtp(OTP).subscribe({
        next: Response => {
          if (Response.data.ok) {
            setUnicardOtpGuid(Response.data.data?.otpGuid);
          }
        },
        error: () => {
          setIsLoading(false);
        },
        complete: () => setIsLoading(false),
      });
    });
  };

  const _onCheckDebt = () => {
    if (!PaymentStore.paymentDetails) return;
    setIsLoading(true);
    if (Validation.validate(ValidationContext) && !PaymentStore.isTemplate) {
      setIsLoading(false);
      return;
    }

    dispatch(onCheckDebt({...PaymentStore}, () => setIsLoading(false)));
  };

  useEffect(() => {
    if (
      PaymentStore.selectedAccount &&
      PaymentStore.amount &&
      !PaymentStore.isTemplate
    ) {
      if (Validation.validate(ValidationContext)) return;
      dispatch(
        GetPaymentDetails(
          {
            ForOpClassCode: PaymentStore.paymentDetails?.forOpClassCode,
            ForFundsSPCode: 'UniWallet',
            ForMerchantCode: PaymentStore.currentService?.merchantCode,
            ForMerchantServiceCode:
              PaymentStore.currentService?.merchantServiceCode,
            AccountNumber: PaymentStore.selectedAccount.accountNumber,
            InAmount: getNumber(PaymentStore.amount),
            ForCustomerType: getString(
              PaymentStore.selectedAccount.customerAccountType?.toString(),
            ),
          },
          () => {
            if (PaymentStore.isTemplate) {
              _onCheckDebt();
            }
          },
        ),
      );
    }
  }, [PaymentStore.selectedAccount, PaymentStore.amount]);

  useEffect(() => {
    if (PaymentStore.selectedAccount && PaymentStore.isTemplate) {
      if (Validation.validate(ValidationContext)) return;
      _onCheckDebt();
    }
  }, [PaymentStore.selectedAccount, PaymentStore.isTemplate]);

  useEffect(() => {
    if (PaymentStore.isTemplate) {
      dispatch({
        type: PAYMENTS_ACTIONS.PAYMENT_SET_ABONENT_CODE,
        abonentCode: PaymentStore.currentPayTemplate?.abonentCode,
      });

      const account = userData.userAccounts?.filter(
        account =>
          account.accountId === PaymentStore.currentPayTemplate?.forFromAccount,
      );

      if (account?.length) {
        dispatch({
          type: PAYMENTS_ACTIONS.PAYMENT_SET_SELECTED_ACCOUNT,
          selectedAccount: account[0],
        });
      }
      onSetAmount(getString(PaymentStore.currentPayTemplate?.debt?.toString()));
    }
  }, [PaymentStore.isTemplate]);

  useEffect(() => {
    if (userData.userAccounts && !userData.isAccountsLoading) {
      let uac = [...(userData.userAccounts || [])];
      setAccounts(uac);
    }
  }, [userData.isAccountsLoading]);

  useEffect(() => {
    if (PaymentStore.paymentDetails?.canPayWithUnipoints === 0) {
      setAccounts(accounts => {
        return accounts?.filter(acc => acc.type !== TYPE_UNICARD);
      });
    }
  }, [PaymentStore.paymentDetails, PaymentStore.selectedAccount]);

  let debt = PaymentStore.debtData?.filter(
    i =>
      i.FieldCode === 'Debt' ||
      i.FieldCode === 'FineAmount' ||
      i.FieldCode === 'TotalDebt' ||
      i.FieldCode === 'Balance',
  );
  let custumer = PaymentStore.debtData?.filter(
    i =>
      i.FieldCode === 'AbonentName' ||
      i.FieldCode === 'NameAndSurname' ||
      i.FieldCode === 'Name' ||
      i.FieldCode === 'UserName',
  );
  let cosumerAddress = PaymentStore.debtData?.filter(
    i => i.FieldCode === 'AbonentAddress' || i.FieldCode === 'Region',
  );
  const _serviceName =
    PaymentStore.currentService?.name ||
    PaymentStore.currentService?.resourceValue ||
    PaymentStore.currentPayTemplate?.merchServiceName;
  const _serviceImageUrl =
    PaymentStore.currentService?.imageUrl ||
    PaymentStore.currentService?.merchantServiceURL ||
    PaymentStore.currentPayTemplate?.imageUrl;

  return (
    <ScrollView contentContainerStyle={styles.avoid}>
      <KeyboardAvoidingView behavior="padding" style={styles.avoid}>
        <View style={[screenStyles.wraper, styles.container]}>
          {otpVisible && (
            <View style={[screenStyles.wraper, styles.otp]}>
              <SetOtp
                otp={otp}
                onSetOtp={setOtp}
                onSendUnicardOTP={SendUnicardOTP}
                style={styles.otpBox}
              />
              <AppButton
                isLoading={PaymentStore.isActionLoading || isLoading}
                onPress={next}
                title={'შემდეგი'}
                style={styles.button}
              />
            </View>
          )}
          <View>
            <View style={styles.abonentInfo}>
              <Image style={styles.logo} source={{uri: _serviceImageUrl}} />
              <View>
                <Text numberOfLines={1} style={styles.serviceName}>
                  {_serviceName}
                </Text>
                <View>
                  <Text style={styles.address}>
                    {custumer && custumer[0].Value}
                    {cosumerAddress && cosumerAddress[0].Value}
                  </Text>
                  <Text style={styles.debt}>
                    {PaymentStore.abonentCode}/{debt && debt[0].Value}
                    {CurrencySimbolConverter(debt && debt[0].CCY)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.accountBox}>
              <Text style={styles.accountBoxTitle}>აირჩიეთ ანგარიში</Text>

              {PaymentStore.selectedAccount ? (
                <AccountItem
                  account={PaymentStore.selectedAccount}
                  onAccountSelect={() => setAccountVisible(true)}
                  style={styles.accountItem}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => setAccountVisible(true)}
                  style={[styles.accountSelectHandler, accountErrorStyle]}>
                  <Image
                    style={styles.dropImg}
                    source={require('./../../../../assets/images/down-arrow.png')}
                  />
                </TouchableOpacity>
              )}

              <AccountSelect
                accounts={_accounts}
                selectedAccount={PaymentStore.selectedAccount}
                accountVisible={accountVisible}
                onSelect={account => onAccountSelect(account)}
                onToggle={() => setAccountVisible(!accountVisible)}
              />
            </View>

            <View style={styles.amountColumn}>
              <Text style={styles.amountLabel}>თანხა</Text>
              <AppInput
                keyboardType="numeric"
                value={PaymentStore.amount}
                onChange={amount => onSetAmount(amount)}
                context={ValidationContext}
                customKey="amount"
                requireds={[required, hasNumeric]}
                style={styles.amountInput}
              />
            </View>

            {!route.params.withTemplate && (
              <View style={styles.amountBox}>
                <Text style={[styles.amountLabel, styles.amountFeeLabel]}>
                  საკომისიო:{' '}
                  {CurrencyConverter(
                    getNumber(PaymentStore.paymentDetails?.amountFee),
                  )}{' '}
                  {CurrencySimbolConverter(GEL)}
                </Text>
                {PaymentStore.paymentDetails?.amount !== undefined && (
                  <Text style={styles.amountValue}>
                    სულ გადასახდელი:{' '}
                    {CurrencyConverter(
                      PaymentStore.isTemplate
                        ? PaymentStore.amount
                        : PaymentStore.paymentDetails?.amount,
                    )}{' '}
                    {CurrencySimbolConverter(GEL)}
                  </Text>
                )}

                <View>
                  <Text style={[styles.amountRange]}>
                    მინიმალური თანხა:{' '}
                    {CurrencyConverter(
                      getNumber(PaymentStore.paymentDetails?.minAmount),
                    )}{' '}
                    {CurrencySimbolConverter(GEL)}
                  </Text>
                  <Text style={[styles.amountRange]}>
                    მაქსიმალური თანხა:{' '}
                    {CurrencyConverter(
                      getNumber(PaymentStore.paymentDetails?.maxAmount),
                    )}{' '}
                    {CurrencySimbolConverter(GEL)}
                  </Text>
                </View>
              </View>
            )}
          </View>
          <AppButton
            isLoading={PaymentStore.isActionLoading || isLoading}
            onPress={next}
            title={'შემდეგი'}
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'space-between',
    paddingBottom: tabHeight,
  },
  avoid: {
    flexGrow: 1,
  },
  abonentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBackGround,
  },
  serviceName: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  address: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.placeholderColor,
  },
  debt: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.placeholderColor,
  },
  accountBox: {
    marginTop: 50,
  },
  accountBoxTitle: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    marginBottom: 15,
  },
  accountItem: {
    backgroundColor: colors.inputBackGround,
    borderRadius: 7,
  },
  accountSelectHandler: {
    height: 54,
    backgroundColor: colors.inputBackGround,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dropImg: {
    marginRight: 12,
  },
  amountInput: {
    marginTop: 17,
  },
  amountLabel: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
  },
  amountFeeLabel: {
    color: colors.danger,
  },
  amountColumn: {
    marginTop: 35,
  },
  amountBox: {
    marginTop: 50,
  },
  amountValue: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    marginTop: 10,
  },
  amountRange: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 12,
    lineHeight: 15,
    color: colors.black,
    marginTop: 10,
  },
  button: {
    marginVertical: 40,
  },
  otp: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    elevation: 3,
  },
  otpBox: {
    marginTop: 40,
  },
});

export default InsertAccointAndAmount;