import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  StyleProp,
  ViewStyle,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AccountSelect, {
  AccountItem,
} from '../../../components/AccountSelect/AccountSelect';
import CurrencySelect, {
  CurrencyItem,
} from '../../../components/CurrencySelect/CurrencySelect';
import AppButton from '../../../components/UI/AppButton';
import AppInput from '../../../components/UI/AppInput';
import AppInputText from '../../../components/UI/AppInputText';
import colors from '../../../constants/colors';
import {GEL} from '../../../constants/currencies';
import {PUSH} from '../../../redux/actions/error_action';
import {IP2PTransactionRequest} from '../../../services/TransactionService';
import {IAccountBallance, ICurrency} from '../../../services/UserService';
import {CurrencySimbolConverter, getNumber} from '../../../utils/Converter';
import {INavigationProps, TRANSFER_TYPES} from '.';
import {
  ITransfersState,
  IGlobalState as ITRansferGlobalState,
  TRANSFERS_ACTION_TYPES,
} from '../../../redux/action_types/transfers_action_types';
import {
  INavigationState,
  IGlobalState as INAVGlobalState,
} from '../../../redux/action_types/navigation_action_types';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import Routes from '../../../navigation/routes';
import {MakeTransaction} from '../../../redux/actions/transfers_actions';
import {TYPE_UNICARD} from '../../../constants/accountTypes';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import {tabHeight} from '../../../navigation/TabNav';
import NavigationService from '../../../services/NavigationService';
import { subscriptionService } from '../../../services/subscriptionService';
import SUBSCRIBTION_KEYS from '../../../constants/subscribtionKeys';

const ValidationContext = 'transfer';

type RouteParamList = {
  params: {
    transferStep: string;
  };
};

const TransferBetweenAccounts: React.FC<INavigationProps> = props => {
  const [fromAccountVisible, setFromAccountVisible] = useState(false);
  const [toAccountVisible, setToAccountVisible] = useState(false);
  const [accounts, setAccounts] = useState<IAccountBallance[] | undefined>();
  const [toCurrencyVisible, setToCurrencyVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fromAccountErrorStyle, setFromAccountErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [toAccountErrorStyle, setToAccountErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [toCurrencyErrorStyle, setToCurrencyErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [amountErrorStyle, setAmountErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [nominationErrorStyle, setNominationErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [currenciesFrom, setCurrenciesFrom] = useState<ICurrency[] | undefined>(
    undefined,
  );
  const dispatch = useDispatch();

  const TransfersStore = useSelector<ITRansferGlobalState>(
    state => state.TransfersReducer,
  ) as ITransfersState;

  const navStore = useSelector<INAVGlobalState>(
    state => state.NavigationReducer,
  ) as INavigationState;

  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;

  /*******************************/

  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();

  const setNomination = (nomination: string | undefined) => {
    dispatch({type: TRANSFERS_ACTION_TYPES.SET_NOMINATION, nomination});
  };

  const setAmount = (amount: string | undefined) => {
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_AMOUNT,
      amount: amount,
    });
  };

  const setTransferStep = (step: string) => {
    const params = {
      ...route.params,
      transferStep: step,
    };
    navigation.navigate(`${step}`, params);
  };

  const onFromAccountSelect = (account: IAccountBallance) => {
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_SELECTED_FROM_ACCOUNT,
      selectedFromAccount: account,
    });
    setFromAccountVisible(!fromAccountVisible);
  };

  useEffect(() => {
    let _acount = {...TransfersStore.selectedFromAccount};
    setCurrenciesFrom(_acount.currencies);
  }, [TransfersStore.selectedFromAccount]);

  const onToAccountSelect = (account: IAccountBallance) => {
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_SELECTED_TO_ACCOUNT,
      selectedToAccount: account,
    });
    setToAccountVisible(!toAccountVisible);
  };

  const onToCurrencySelect = (currency: ICurrency) => {
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_SELECTED_TO_CURRENCY,
      selectedToCurrency: currency,
    });
    setToCurrencyVisible(!toCurrencyVisible);
  };

  const makeTransaction = (toBank: boolean = false) => {
    const data: IP2PTransactionRequest = {
      toAccountNumber: TransfersStore.selectedToAccount?.accountNumber,
      fromAccountNumber: TransfersStore.selectedFromAccount?.accountNumber,
      nomination: TransfersStore.nomination,
      ccy: TransfersStore.selectedToCurrency?.key,
      ccyto: TransfersStore.selectedToCurrency?.key,
      amount: getNumber(TransfersStore.amount),
      otp: null,
    };

    dispatch(MakeTransaction(toBank, data));
  };

  const setTransferType = (type: string | undefined) => {
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_TRASNSFER_TYPE,
      transferType: type,
    });
  };

  useEffect(() => {
    setNomination('საკუთარ ანგარიშებს შორის');
    setTransferType(TRANSFER_TYPES.toBank);
  }, []);

  useEffect(() => {
    if (TransfersStore.transactionResponse) {
      setTransferStep(Routes.TransferBetweenAcctounts_SUCCES);
    }
  }, [TransfersStore.transactionResponse]);

  useEffect(() => {
    if (!TransfersStore.fullScreenLoading) {
      setIsLoading(false);
    }
  }, [TransfersStore.fullScreenLoading]);

  useEffect(() => {
    if (userData.userAccounts && !userData.isAccountsLoading) {
      let uac = [...(userData.userAccounts || [])];
      uac = uac.filter(account => account.type !== TYPE_UNICARD);
      setAccounts(uac);
    }
  }, [userData.isAccountsLoading]);

  const onOperationHandle = () => {
    if (route.params.transferStep === Routes.TransferBetweenAcctounts_SUCCES) {
      subscriptionService.sendData(SUBSCRIBTION_KEYS.FETCH_USER_ACCOUNTS, true);
      NavigationService.navigate(navStore.parentRoute);
    }
    setIsLoading(true);
    if (!TransfersStore.selectedFromAccount) {
      setFromAccountErrorStyle({borderColor: colors.danger, borderWidth: 1});
      setIsLoading(false);
      return;
    }

    if (!TransfersStore.selectedToAccount) {
      setToAccountErrorStyle({borderColor: colors.danger, borderWidth: 1});
      setIsLoading(false);
      return;
    }

    if (
      route.params.transferStep ===
      Routes.TransferBetweenAcctounts_CHOOSE_ACCOUNTS
    ) {
      setTransferStep(Routes.TransferBetweenAcctounts_SET_CURRENCY);
      setIsLoading(false);
      return;
    } else if (
      route.params.transferStep === Routes.TransferBetweenAcctounts_SET_CURRENCY
    ) {
      if (!TransfersStore.amount || isNaN(parseInt(TransfersStore.amount))) {
        setAmountErrorStyle({
          borderBottomColor: colors.danger,
          borderBottomWidth: 1,
        });
        setIsLoading(false);
        return;
      } else {
        setAmountErrorStyle({});
      }

      if (!TransfersStore.selectedToCurrency) {
        setToCurrencyErrorStyle({
          borderBottomColor: colors.danger,
          borderBottomWidth: 1,
        });
        setIsLoading(false);
        return;
      } else {
        setToCurrencyErrorStyle({});
      }

      if (!TransfersStore.nomination) {
        setNominationErrorStyle({borderColor: colors.danger, borderWidth: 1});
        setIsLoading(false);
        return;
      } else {
        setNominationErrorStyle({});
      }

      if (getNumber(TransfersStore.amount) < 1) {
        dispatch(
          PUSH(
            `მინიმალური გადასარიცხი თანხა 0.1 ${CurrencySimbolConverter(GEL)}`,
          ),
        );
        setIsLoading(false);
        setAmountErrorStyle({
          borderBottomColor: colors.danger,
          borderBottomWidth: 1,
        });
        return;
      } else {
        setAmountErrorStyle({});
      }

      makeTransaction();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.avoid}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={0}
        style={styles.avoid}>
        <View style={styles.container}>
          <View
            style={[
              styles.contentContainer,
              route.params.transferStep ===
                Routes.TransferBetweenAcctounts_SUCCES && styles.withSucces,
            ]}>
            {(route.params.transferStep ===
              Routes.TransferBetweenAcctounts_CHOOSE_ACCOUNTS ||
              route.params.transferStep ===
                Routes.TransferBetweenAcctounts_SET_CURRENCY) && (
              <>
                <View style={styles.accountBox}>
                  <Text style={styles.accountBoxTitle}>საიდან</Text>

                  {TransfersStore.selectedFromAccount ? (
                    <AccountItem
                      account={TransfersStore.selectedFromAccount}
                      onAccountSelect={() => setFromAccountVisible(true)}
                      style={styles.accountItem}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => setFromAccountVisible(true)}
                      style={[
                        styles.accountSelectHandler,
                        fromAccountErrorStyle,
                      ]}>
                      <Image
                        style={styles.dropImg}
                        source={require('./../../../assets/images/down-arrow.png')}
                      />
                    </TouchableOpacity>
                  )}

                  <AccountSelect
                    notSelectable={TransfersStore.selectedToAccount}
                    accounts={accounts}
                    selectedAccount={TransfersStore.selectedFromAccount}
                    accountVisible={fromAccountVisible}
                    onSelect={account => onFromAccountSelect(account)}
                    onToggle={() => setFromAccountVisible(!fromAccountVisible)}
                  />
                </View>

                <View style={styles.accountBox}>
                  <Text style={styles.accountBoxTitle}>სად</Text>

                  {TransfersStore.selectedToAccount ? (
                    <AccountItem
                      account={TransfersStore.selectedToAccount}
                      onAccountSelect={() => setToAccountVisible(true)}
                      style={styles.accountItem}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => setToAccountVisible(true)}
                      style={[
                        styles.accountSelectHandler,
                        toAccountErrorStyle,
                      ]}>
                      <Image
                        style={styles.dropImg}
                        source={require('./../../../assets/images/down-arrow.png')}
                      />
                    </TouchableOpacity>
                  )}

                  <AccountSelect
                    notSelectable={TransfersStore.selectedFromAccount}
                    accounts={accounts}
                    selectedAccount={TransfersStore.selectedToAccount}
                    accountVisible={toAccountVisible}
                    onSelect={account => onToAccountSelect(account)}
                    onToggle={() => setToAccountVisible(!toAccountVisible)}
                  />
                </View>
              </>
            )}
            {route.params.transferStep ===
              Routes.TransferBetweenAcctounts_SET_CURRENCY && (
              <>
                <View style={styles.amountContainer}>
                  <AppInputText
                    label="თანხის ოდენობა"
                    onChangeText={setAmount}
                    Style={[styles.amountInput, amountErrorStyle]}
                    value={TransfersStore.amount}
                  />
                  <View style={[styles.currencyBox, toCurrencyErrorStyle]}>
                    {TransfersStore.selectedToCurrency ? (
                      <CurrencyItem
                        defaultTitle="ვალუტა"
                        currency={TransfersStore.selectedToCurrency}
                        onCurrencySelect={() => setToCurrencyVisible(true)}
                        style={styles.currencyItem}
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => setToCurrencyVisible(true)}
                        style={[styles.currencySelectHandler]}>
                        <Text style={styles.currencyPlaceholder}>ვალუტა</Text>
                        <Image
                          style={styles.dropImg}
                          source={require('./../../../assets/images/down-arrow.png')}
                        />
                      </TouchableOpacity>
                    )}

                    <CurrencySelect
                      currencies={currenciesFrom}
                      selectedCurrency={TransfersStore.selectedToCurrency}
                      currencyVisible={toCurrencyVisible}
                      onSelect={currency => onToCurrencySelect(currency)}
                      onToggle={() => setToCurrencyVisible(!toCurrencyVisible)}
                    />
                  </View>
                </View>

                <View style={styles.nominationBox}>
                  <Text style={styles.accountBoxTitle}>დანიშნულება</Text>
                  <AppInput
                    customKey="transfer"
                    context={ValidationContext}
                    placeholder="საკუთარ ანგარიშებს შორის"
                    value={TransfersStore.nomination}
                    style={nominationErrorStyle}
                    onChange={setNomination}
                  />
                </View>
              </>
            )}
            {route.params.transferStep ===
              Routes.TransferBetweenAcctounts_SUCCES && (
              <View style={styles.succesInner}>
                <Text style={styles.succesText}>
                  გადარიცხვა წარმატებით დასრულდა
                </Text>
                <Image
                  source={require('./../../../assets/images/succes_icon.png')}
                  style={styles.succesImg}
                />
              </View>
            )}
          </View>
          <AppButton
            isLoading={TransfersStore.fullScreenLoading || isLoading}
            onPress={onOperationHandle}
            title={
              route.params.transferStep ===
              Routes.TransferBetweenAcctounts_SUCCES
                ? 'დახურვა'
                : 'შემდეგი'
            }
            style={styles.handleButton}
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
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: tabHeight,
  },
  avoid: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingTop: 20,
  },
  handleButton: {
    marginVertical: 40,
  },
  accountBox: {
    marginTop: 20,
  },
  nominationBox: {
    marginTop: 40,
  },
  accountBoxTitle: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    marginBottom: 15,
  },
  accountItem: {
    //paddingLeft: 0
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
  currencyBox: {
    height: 50,
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBackGround,
  },
  currencyItem: {
    backgroundColor: colors.none,
    borderTopColor: colors.none,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: colors.none,
  },
  currencySelectHandler: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  currencyPlaceholder: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.placeholderColor,
    marginRight: 7,
  },
  amountInput: {
    paddingTop: 0,
    marginHorizontal: 0,
    marginLeft: 5,
    flex: 1,
    borderBottomWidth: 1,
    marginRight: 25,
    borderBottomColor: colors.inputBackGround,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  withSucces: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  succesText: {
    textAlign: 'center',
    justifyContent: 'space-between',
    fontFamily: 'FiraGO-Medium',
    fontSize: 16,
    lineHeight: 19,
    color: colors.black,
    marginTop: 28,
  },
  succesInner: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  succesImg: {
    marginTop: 40,
  },
  templateIcon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginTop: 30,
  },
});

export default TransferBetweenAccounts;