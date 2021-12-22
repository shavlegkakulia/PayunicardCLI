import React, {createRef, useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FullScreenLoader from '../../../components/FullScreenLoading';
import colors from '../../../constants/colors';
import NetworkService from '../../../services/NetworkService';
import {ITransferTemplate} from '../../../services/TemplatesService';
import screenStyles from '../../../styles/screens';
import DashboardLayout from '../../DashboardLayout';
import TransferTemplates from './TransferTemplates';
import {useDispatch, useSelector} from 'react-redux';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import {IAccountBallance, ICurrency} from '../../../services/UserService';
import {FetchUserAccounts} from '../../../redux/actions/user_actions';
import opClassCodes from '../../../constants/opClassCodes';
import {getArray} from '../../../utils/Converter';
import {TYPE_UNICARD} from '../../../constants/accountTypes';
import {getTransferTemplates} from '../../../redux/actions/transfers_actions';

import {
  ITransfersState,
  IGlobalState as ITRansferGlobalState,
  TRANSFERS_ACTION_TYPES,
} from './../../../redux/action_types/transfers_action_types';
import Routes from '../../../navigation/routes';
import {useNavigationState} from '@react-navigation/native';
import {NAVIGATION_ACTIONS} from '../../../redux/action_types/navigation_action_types';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import PaginationDots from '../../../components/PaginationDots';

export const TRANSFER_TYPES = {
  betweenAccounts: 'betweenAccounts',
  Convertation: 'Convertation',
  toBank: 'P2B.BANK',
  toUni: 'P2P.INTER',
};

interface INavigation {
  goBack: Function;
  getParam: Function;
  navigate: Function;
  push: Function;
  reset: Function;
  addListener: Function;
}

export interface INavigationProps {
  navigation?: INavigation;
  selectdeAccount?: IAccountBallance | undefined;
}

const Transfers: React.FC<INavigationProps> = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [_accounts, setAccounts] = useState<IAccountBallance[] | undefined>();

  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;

  const TransfersStore = useSelector<ITRansferGlobalState>(
    state => state.TransfersReducer,
  ) as ITransfersState;

  const [transferSectionStep, setTransferSectionStep] = useState<number>(0);

  const carouselRef = createRef<ScrollView>();

  const dispatch = useDispatch();

  const startTransferFromTemplate = (template: ITransferTemplate) => {
    function initCommon() {
      setIsTemplate(true);
      setAmount(template.amount);
      setNomination(template.description);
      setBenificarName(template.beneficiaryName);
    }

    if (
      template.opClassCode?.toLocaleUpperCase() === opClassCodes.inWallet &&
      template.isBetweenOwnAccounts === false
    ) {
      initCommon();
      setBenificarAccount(template.toAccountNumber);
      let account: IAccountBallance[] | undefined =
        userData.userAccounts?.filter(
          acc => acc.accountNumber === template.accountNumber,
        );

      if (account) {
        dispatch({
          type: TRANSFERS_ACTION_TYPES.SET_SELECTED_FROM_ACCOUNT,
          selectedFromAccount: account[0],
        });
        let currency: ICurrency[] | undefined = account[0]?.currencies?.filter(
          cur => cur.key === template.ccyFrom,
        );
        if (currency) {
          dispatch({
            type: TRANSFERS_ACTION_TYPES.SET_SELECTED_FROM_CURRENCY,
            selectedFromCurrency: currency[0],
          });
        }
      }

      transferToUni();
    } else if (
      template.opClassCode?.toLocaleUpperCase() === opClassCodes.toBank
    ) {
      initCommon();
      setBenificarAccount(template.beneficiaryAccountNumber);
      let account: IAccountBallance[] | undefined =
        userData.userAccounts?.filter(
          acc =>
            acc.accountId === template.forFromExternalAccountId ||
            acc.accountId === template.forFromAccountId,
        );
      if (account) {
        dispatch({
          type: TRANSFERS_ACTION_TYPES.SET_SELECTED_FROM_ACCOUNT,
          selectedFromAccount: account[0],
        });
        let currency: ICurrency[] | undefined = account[0]?.currencies?.filter(
          cur => cur.key === template.ccyFrom,
        );
        if (currency) {
          dispatch({
            type: TRANSFERS_ACTION_TYPES.SET_SELECTED_FROM_CURRENCY,
            selectedFromCurrency: currency[0],
          });
        }
      }

      transferToBank();
    }
  };

  const fetchAccounts = () => {
    NetworkService.CheckConnection(() => {
      dispatch(FetchUserAccounts());
    });
  };

  const routes = useNavigationState(state => state.routes);

  const transferBetweenAccounts = () => {
    const currentRoute = routes[routes.length - 1].name;
    dispatch({
      type: NAVIGATION_ACTIONS.SET_PARENT_ROUTE,
      parentRoute: currentRoute,
    });
    props.navigation?.navigate(
      Routes.TransferBetweenAcctounts_CHOOSE_ACCOUNTS,
      {
        transferStep: Routes.TransferBetweenAcctounts_CHOOSE_ACCOUNTS,
      },
    );
  };

  const transferToBank = () => {
    const currentRoute = routes[routes.length - 1].name;
    dispatch({
      type: NAVIGATION_ACTIONS.SET_PARENT_ROUTE,
      parentRoute: currentRoute,
    });
    props.navigation?.navigate(Routes.TransferToBank_CHOOSE_ACCOUNTS, {
      transferStep: Routes.TransferToBank_CHOOSE_ACCOUNTS,
    });
  };

  const transferToUni = () => {
    const currentRoute = routes[routes.length - 1].name;
    dispatch({
      type: NAVIGATION_ACTIONS.SET_PARENT_ROUTE,
      parentRoute: currentRoute,
    });
    props.navigation?.navigate(Routes.TransferToUni_CHOOSE_ACCOUNTS, {
      transferStep: Routes.TransferToUni_CHOOSE_ACCOUNTS,
    });
  };

  const transferConvertation = () => {
    const currentRoute = routes[routes.length - 1].name;
    dispatch({
      type: NAVIGATION_ACTIONS.SET_PARENT_ROUTE,
      parentRoute: currentRoute,
    });
    props.navigation?.navigate(Routes.TransferConvertation_CHOOSE_ACCOUNTS, {
      transferStep: Routes.TransferConvertation_CHOOSE_ACCOUNTS,
    });
  };

  const setNomination = (nomination: string | undefined) => {
    dispatch({type: TRANSFERS_ACTION_TYPES.SET_NOMINATION, nomination});
  };

  const setBenificarName = (name: string | undefined) => {
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_BENIFICARY_NAME,
      benificarName: name,
    });
  };

  const setBenificarAccount = (account: string | undefined) => {
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_BENIFICARY_ACCOUNT,
      benificarAccount: account,
    });
  };

  const setAmount = (amount: string | undefined) => {
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_AMOUNT,
      amount: amount,
    });
  };

  const setIsTemplate = (isTemplate: boolean) => {
    dispatch({
      type: TRANSFERS_ACTION_TYPES.SET_IS_TEMPLATE,
      isTemplate: isTemplate,
    });
  };

  const onFetchData = () => {
    dispatch(getTransferTemplates());
    fetchAccounts();
  };

  const onRefresh = useCallback(() => {
    NetworkService.CheckConnection(
      () => {
        onFetchData();
      },
      () => {
        setRefreshing(false);
      },
    );
  }, []);

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

  useEffect(() => {
    console.log(TransfersStore.transferTemplates);
    NetworkService.CheckConnection(() => {
      if (!userData.userAccounts?.length) dispatch(FetchUserAccounts());
      if (!TransfersStore.transferTemplates?.length)
        dispatch(getTransferTemplates());
    });
  }, []);

  useEffect(() => {
    if (userData.userAccounts)
      setAccounts(
        acc =>
          (acc = [...getArray(userData.userAccounts)]?.filter(
            acc => acc.type !== TYPE_UNICARD,
          )),
      );
  }, [userData.userAccounts]);

  return (
    <>
      <DashboardLayout>
        {TransfersStore.fullScreenLoading && (
          <FullScreenLoader background={colors.none} hideLoader />
        )}

        <ScrollView
          style={screenStyles.screenContainer}
          refreshControl={
            <RefreshControl
              progressBackgroundColor={colors.white}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }>
          <View style={[screenStyles.wraperWithShadow]}>
            <View
              style={[
                styles.transfersSectionContainer,
                screenStyles.shadowedCardbr15,
              ]}>
              <View style={styles.transfersSectionContainerHeader}>
                <Text style={styles.transfersSectionContainerTitle}>
                  {translate.t('tabNavigation.transfers')}
                </Text>
                <PaginationDots step={transferSectionStep} length={2} />
              </View>
              <ScrollView
                ref={carouselRef}
                onScroll={({nativeEvent}) =>
                  onChangeTransferSectionStep(nativeEvent)
                }
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                horizontal>
                  <View style={styles.iGroup}>
                <TouchableOpacity
                  style={styles.transfersSectionContainerItem}
                  onPress={transferBetweenAccounts}>
                  <View
                    style={styles.transfersSectionContainerItemImageContainer}>
                    <Image
                      source={require('./../../../assets/images/between_accounts.png')}
                      style={styles.transfersSectionContainerItemImage}
                    />
                  </View>
                  <View style={styles.transfersSectionContainerItemDetails}>
                    <Text
                      style={styles.transfersSectionContainerItemDetailsTitle}>
                      {translate.t('transfer.betweeenOwnAccounts')}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.transfersSectionContainerItem}
                  onPress={transferConvertation}>
                  <View
                    style={styles.transfersSectionContainerItemImageContainer}>
                    <Image
                      source={require('./../../../assets/images/convertation.png')}
                      style={styles.transfersSectionContainerItemImage}
                    />
                  </View>
                  <View style={styles.transfersSectionContainerItemDetails}>
                    <Text
                      style={styles.transfersSectionContainerItemDetailsTitle}>
                      {translate.t('transfer.currencyExchange')}
                    </Text>
                  </View>
                </TouchableOpacity>
                </View>

                <View style={styles.iGroup}>
                <TouchableOpacity
                  style={styles.transfersSectionContainerItem}
                  onPress={transferToUni}>
                  <View
                    style={styles.transfersSectionContainerItemImageContainer}>
                    <Image
                      source={require('./../../../assets/images/to_wallet.png')}
                      style={styles.transfersSectionContainerItemImage}
                    />
                  </View>
                  <View style={styles.transfersSectionContainerItemDetails}>
                    <Text
                      style={styles.transfersSectionContainerItemDetailsTitle}>
                      {translate.t('transfer.toUniWallet')}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.transfersSectionContainerItem}
                  onPress={transferToBank}>
                  <View
                    style={styles.transfersSectionContainerItemImageContainer}>
                    <Image
                      source={require('./../../../assets/images/to_bank.png')}
                      style={styles.transfersSectionContainerItemImage}
                    />
                  </View>
                  <View style={styles.transfersSectionContainerItemDetails}>
                    <Text
                      style={styles.transfersSectionContainerItemDetailsTitle}>
                      {translate.t('transfer.toBank')}
                    </Text>
                  </View>
                </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={styles.endof}>
            <View style={screenStyles.wraperWithShadow}>
              <TransferTemplates
                isTemplatesFetching={TransfersStore.isTemplatesLoading}
                templates={TransfersStore.transferTemplates}
                onStartTransferFromTemplate={startTransferFromTemplate}
              />
            </View>
          </View>
        </ScrollView>
      </DashboardLayout>
    </>
  );
};

const styles = StyleSheet.create({
  transfersSectionContainer: {
    marginTop: 38,
    padding: 17,
    paddingBottom: 24,
    backgroundColor: colors.white,
  },
  transfersSectionContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 18,
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  transfersSectionContainerTitle: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  transfersSectionContainerItem: {
    overflow: 'hidden',
    marginHorizontal: 9,
    alignItems: 'center',
    flex: 1,
  },
  iGroup: {
    flexDirection: 'row',
    width: Dimensions.get("window").width - 66
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
    shadowRadius: 25,
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
  transfersSectionContainerItemDetailsTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 12,
    lineHeight: 15,
    color: colors.black,
    textAlign: 'center',
  },
  transferItemsWraper: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
  },
  sectionContainerItemDetailsTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 12,
    lineHeight: 15,
    color: colors.black,
    textAlign: 'center',
  },
  transfersSectionContainerItemScroller: {
    overflow: 'hidden',
    alignItems: 'center',
    width: '33.3333333333%',
  },
  endof: {
    marginBottom: 30,
  },
});
export default Transfers;
