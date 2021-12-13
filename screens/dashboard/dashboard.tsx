import React, {useCallback, useRef} from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {ScrollView, View, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ActionSheetCustom from './../../components/actionSheet';
import colors from '../../constants/colors';
import userStatuses from '../../constants/userStatuses';
import {
  FetchUserAccounts,
  FetchUserProducts,
  FetchUserTotalBalance,
} from '../../redux/actions/user_actions';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../redux/action_types/user_action_types';
import NetworkService from '../../services/NetworkService';
import screenStyles from '../../styles/screens';
import DashboardLayout from '../DashboardLayout';
import CurrentMoney from './home/CurrentMoney';
import TransactionsList from './transactions/TransactionsList';
import Routes from '../../navigation/routes';
import {subscriptionService} from '../../services/subscriptionService';
import Actions from '../../containers/Actions';
import SUBSCRIBTION_KEYS from '../../constants/subscribtionKeys';
import {NAVIGATION_ACTIONS} from '../../redux/action_types/navigation_action_types';
import {useNavigationState} from '@react-navigation/native';
import {PAYMENTS_ACTIONS} from '../../redux/action_types/payments_action_type';
import NavigationService from '../../services/NavigationService';
import {TRANSFERS_ACTION_TYPES} from '../../redux/action_types/transfers_action_types';
import {debounce} from '../../utils/utils';
import {
  NavigationEventSubscription,
  NavigationScreenProp,
} from 'react-navigation';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../redux/action_types/translate_action_types';
import AccountStatusView from './home/AccounStatus';
import ProductsView from './home/AboutProducts';
import UnicardAction from './home/UnicardActionView';
import OffersView from './home/Offers';

export interface IProps {
  navigation: NavigationScreenProp<any, any>;
}

const Dashboard: React.FC<IProps> = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;

  const [refreshing, setRefreshing] = useState(false);

  const [actionsSheetHeader, setActionsSheetHeader] =
    useState<JSX.Element | null>(null);
  const [actionsVisible, setActionsVisible] = useState(false);
  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const dispatch = useDispatch();

  const {documentVerificationStatusCode, customerVerificationStatusCode} =
    userData.userDetails || {};

  const start_verification = () => {
    if (
      (documentVerificationStatusCode === userStatuses.Enum_NotVerified ||
        documentVerificationStatusCode ===
          userStatuses.Enum_PartiallyProcessed) &&
      customerVerificationStatusCode === userStatuses.Enum_NotVerified
    ) {
      NavigationService.navigate(Routes.Verification, {verificationStep: 0});
    }
  };

  const _routes = useNavigationState(state => state.routes);

  const transferToUni = () => {
    const currentRoute = _routes[_routes.length - 1].name;
    //cleare transfer global state
    dispatch({type: TRANSFERS_ACTION_TYPES.RESET_TRANSFER_STATES});
    dispatch({
      type: NAVIGATION_ACTIONS.SET_PARENT_ROUTE,
      parentRoute: currentRoute,
    });

    NavigationService.navigate(Routes.TransferToUni_CHOOSE_ACCOUNTS, {
      transferStep: Routes.TransferToUni_CHOOSE_ACCOUNTS,
      newTemplate: true,
    });
  };

  const closeActionSheet = () => {
    setActionsVisible(false);
  };

  const FetchUserData = () => {
    NetworkService.CheckConnection(() => {
      dispatch(FetchUserProducts());
      dispatch(FetchUserAccounts());
      dispatch(FetchUserTotalBalance());
    });
  };

  const GetRouteInfo = useCallback((e: any) => {
    const {index, routes} = e.data.state;
    const currentRoute = routes[index]?.name;

    console.log('*********logging here route state*********', currentRoute);

    dispatch({
      type: NAVIGATION_ACTIONS.SET_CURRENT_ROUTE,
      currentRoute: currentRoute,
    });

    NavigationService.setCurrentRoute(currentRoute);

    //reset payments data
    if (currentRoute === Routes.Payments) {
      dispatch({type: PAYMENTS_ACTIONS.RESET_PAYEMENT_DATA});
    }

    //reset transfers data
    if (currentRoute === Routes.Transfers) {
      dispatch({type: TRANSFERS_ACTION_TYPES.RESET_TRANSFER_STATES});
    }
  }, []);

  const RouteListener = useRef<NavigationEventSubscription>();

  useEffect(() => {
    RouteListener.current = props.navigation.addListener('state', GetRouteInfo);

    return () => {
      if (RouteListener.current)
        try {
          RouteListener.current?.remove();
        } catch (err) {}
    };
  }, []);

  const onRefresh = () => {
    FetchUserData();
  };

  useEffect(() => {
    NetworkService.CheckConnection(() => {
      if (!userData.userProducts?.length) dispatch(FetchUserProducts());
      if (!userData.userAccounts?.length) dispatch(FetchUserAccounts());
      if (!userData.userTotalBalance) dispatch(FetchUserTotalBalance());
    });
  }, []);

  useEffect(() => {
    if (
      !userData.useAccountStatements &&
      !userData.isTotalBalanceLoading &&
      !userData.isUserProductsLoading
    ) {
      setRefreshing(false);
    }
  }, [
    userData.isStatementsLoading,
    userData.isTotalBalanceLoading,
    userData.isUserProductsLoading,
  ]);

  const actionSHeetCloseDelay = debounce((e: Function) => e(), 1000);

  useEffect(() => {
    subscriptionService.getData().subscribe(data => {
      if (
        data?.key === SUBSCRIBTION_KEYS.OPEN_ACTIONS_ACTIONSHEET &&
        !actionsVisible
      ) {
        setActionsVisible(true);
      } else if (
        data?.key === SUBSCRIBTION_KEYS.OPEN_CREATE_TRANSFER_TEMPLATE
      ) {
        actionSHeetCloseDelay(transferToUni);
        closeActionSheet();
      } else if (data?.key === SUBSCRIBTION_KEYS.FETCH_USER_ACCOUNTS) {
        dispatch(FetchUserAccounts());
      } else if (data?.key === SUBSCRIBTION_KEYS.OPEN_CARDS_STOTE) {
        actionSHeetCloseDelay(() =>
          NavigationService.navigate(Routes.CardsStore),
        );
        closeActionSheet();
      } else if (data?.key === SUBSCRIBTION_KEYS.START_TOPUP) {
        actionSHeetCloseDelay(() =>
          NavigationService.navigate(Routes.TopupFlow),
        );
        closeActionSheet();
      } else if (data?.key === SUBSCRIBTION_KEYS.ADD_BANK_CARD) {
        actionSHeetCloseDelay(() =>
          NavigationService.navigate(Routes.addBankCard),
        );
        closeActionSheet();
      } else if (data?.key === SUBSCRIBTION_KEYS.OPEN_CREATE_PAYMENT_TEMPLATE) {
        actionSHeetCloseDelay(() =>
          NavigationService.navigate(Routes.CreatePayTemplate),
        );
        closeActionSheet();
      }
    });

    return () => subscriptionService.clearData();
  }, []);

  const ActionsSheetHeight = 440;

  return (
    <DashboardLayout>
      <ScrollView
        style={screenStyles.screenContainer}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={colors.white}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <View style={screenStyles.wraperWithShadow}>
          <AccountStatusView onStartVerification={start_verification} />
        </View>
        <View style={screenStyles.wraper}>
          <CurrentMoney />
        </View>
        <View style={screenStyles.wraperWithShadow}>
          <UnicardAction />
        </View>
        <View style={screenStyles.wraperWithShadow}>
          <ProductsView />
        </View>
        <OffersView />
        <View style={screenStyles.wraper}>
          <TransactionsList />
        </View>
      </ScrollView>

      <ActionSheetCustom
        header={actionsSheetHeader}
        scrollable={true}
        hasDraggableIcon={false}
        visible={actionsVisible}
        hasScroll={true}
        height={ActionsSheetHeight}
        onPress={closeActionSheet}>
        <Actions
          title={translate.t('plusSign.chooseService')}
          sendHeader={setActionsSheetHeader}
        />
      </ActionSheetCustom>
    </DashboardLayout>
  );
};

export default Dashboard;
