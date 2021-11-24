import React, {useCallback, useRef} from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ActionSheetCustom from './../../components/actionSheet';
import PaginationDots from '../../components/PaginationDots';
import colors from '../../constants/colors';
import currencies from '../../constants/currencies';
import userStatuses from '../../constants/userStatuses';
import {useDimension} from '../../hooks/useDimension';
import {
  FetchUserAccounts,
  FetchUserAccountStatements,
  FetchUserDetail,
  FetchUserProducts,
  FetchUserTotalBalance,
} from '../../redux/actions/user_actions';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../redux/action_types/user_action_types';
import NetworkService from '../../services/NetworkService';
import screenStyles from '../../styles/screens';
import {CurrencyConverter} from '../../utils/Converter';
import DashboardLayout from '../DashboardLayout';
import CurrentMoney from './currentMoney';
import TransactionsList from './transactions/TransactionsList';
import Verification from './Verification/Index';
import Routes from '../../navigation/routes';
import {subscriptionService} from '../../services/subscriptionService';
import Actions from '../../containers/Actions';
import SUBSCRIBTION_KEYS from '../../constants/subscribtionKeys';
import {NAVIGATION_ACTIONS} from '../../redux/action_types/navigation_action_types';
import {useNavigationState} from '@react-navigation/native';
import {PAYMENTS_ACTIONS} from '../../redux/action_types/payments_action_type';
import NavigationService, {OpenDrawer} from '../../services/NavigationService';
import {TRANSFERS_ACTION_TYPES} from '../../redux/action_types/transfers_action_types';
import {debounce} from '../../utils/utils';
import UserService, {IFund} from '../../services/UserService';
import { NavigationEventSubscription, NavigationScreenProp } from 'react-navigation';

const offers = [
  {
    title: 'სპეციალური შეთავაზება',
    subtitle: 'დააგემოვნე აზიური სამზარეულო TOKYO-ში',
    image: require('./../../assets/images/business1.jpeg'),
  },
  {
    title: 'სპეციალური შეთავაზება',
    subtitle: 'შეიძინე მუდამ განახლებული კოლექცია CITY MALL-ში.',
    image: require('./../../assets/images/business2.jpeg'),
  },
  {
    title: 'სპეციალური შეთავაზება',
    subtitle: 'SUMMER IN `თბილისი`.',
    image: require('./../../assets/images/business3.jpeg'),
  },
];

export interface IProps {
  navigation: NavigationScreenProp<any,any>
};

const Dashboard: React.FC<IProps> = props => {
  const [offersStep, setOffersStep] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isVerificationStart, setIsVerificationStart] = useState(false);
  const screenSize = useDimension();
  const [verifiSheetHeader, setVerifySheetHeader] =
    useState<JSX.Element | null>(null);
  const [actionsSheetHeader, setActionsSheetHeader] =
    useState<JSX.Element | null>(null);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [isFundsLoading, setIsFundsLoading] = useState<boolean>(false);
  const [funds, setFunds] = useState<IFund[] | undefined>();
  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const dispatch = useDispatch();

  const handleOffersScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    let overView = event.nativeEvent.contentOffset.x / (screenSize.width - 25);
    setOffersStep(Math.round(overView));
  };

  const {documentVerificationStatusCode, customerVerificationStatusCode} =
    userData.userDetails || {};

  const start_verification = () => {
    if (
      (documentVerificationStatusCode === userStatuses.Enum_NotVerified ||
        documentVerificationStatusCode ===
          userStatuses.Enum_PartiallyProcessed) &&
      customerVerificationStatusCode === userStatuses.Enum_NotVerified
    ) {
      setIsVerificationStart(true);
      refRBSheet.current.open();
    }
  };

  const openUnicardSidebar = () => {
    OpenDrawer && OpenDrawer[1]();
  };

  const close_verification = () => {
    setIsVerificationStart(false);
    NetworkService.CheckConnection(() => {
      dispatch(FetchUserDetail());
    });
    if (refRBSheet.current) refRBSheet.current?.close();
  };

  const refRBSheet = useRef<any>();

  const shadowedCardConditionalClass = Platform.select({
    ios: screenStyles.shadowedCardbr15IOS,
    android: screenStyles.shadowedCardbr15
  })

  const AccountStatusView = ({
    onStartVerification,
  }: {
    onStartVerification: () => void;
  }) => {
    let statusView = <></>;
    if (
      documentVerificationStatusCode === userStatuses.Enum_NotVerified &&
      customerVerificationStatusCode === userStatuses.Enum_NotVerified
    ) {
      statusView = (
        <>
          <Image
            source={require('../../assets/images/alert_red.png')}
            style={styles.accountStatusViewSimbol}
          />
          <Text style={styles.accountStatusViewText}>
            საფულით სრულფასოვნად სარგებლობისთვის გაიარეთ იდენტიფიკაცია
          </Text>
        </>
      );
    } else if (
      documentVerificationStatusCode === userStatuses.Enum_Verified &&
      customerVerificationStatusCode === userStatuses.Enum_Verified
    ) {
      statusView = (
        <>
          <Image
            source={require('../../assets/images/round-checked-20x20.png')}
            style={styles.accountStatusViewSimbol}
          />
          <Text style={styles.accountStatusViewText}>
            ანგარიში ვერიფიცირებულია
          </Text>
        </>
      );
    } else if (
      documentVerificationStatusCode === userStatuses.Enum_PartiallyProcessed
    ) {
      statusView = (
        <>
          <Image
            source={require('../../assets/images/alert_red.png')}
            style={styles.accountStatusViewSimbol}
          />
          <Text style={styles.accountStatusViewText}>
            საფულით სრულფასოვნად სარგებლობისთვის გაიარეთ იდენტიფიკაცია
          </Text>
        </>
      );
    } else {
      statusView = (
        <>
          <Image
            source={require('../../assets/images/alert_orange.png')}
            style={styles.accountStatusViewSimbol}
          />
          <Text style={styles.accountStatusViewText}>
            ანგარიში ვერიფიკაციის მოლოდინშია
          </Text>
        </>
      );
    }

    return (
      <View style={[styles.accountStatusView, shadowedCardConditionalClass]}>
        <View style={styles.accountStatusViewInner}>
          <TouchableOpacity
            onPress={onStartVerification}
            style={styles.accountStatusViewTouchable}>
            {userData.isUserLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.loadingBox}
              />
            ) : (
              statusView
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const productsView = (
    <View style={[styles.productsViewContainer, shadowedCardConditionalClass]}>
      <View style={styles.productsViewHeader}>
        <Text style={styles.productsViewTitle}>ჩემი პროდუქტები</Text>
        <TouchableOpacity
          onPress={() => NavigationService.navigate(Routes.Products)}>
          <Text style={styles.productsViewSeeall}>ყველა</Text>
        </TouchableOpacity>
      </View>
      {userData.isUserProductsLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.loadingBox}
        />
      ) : (
        userData.userProducts?.map((product, index) => (
          <View style={styles.ProductsViewItem} key={`products${index}`}>
            <Image
              source={{uri: product.imageURL}}
              style={styles.productsViewLogo}
            />
            <View style={styles.productsItemRight}>
              <View style={styles.productsItemRightInner}>
                <Text style={styles.productsViewItemTitle}>
                  {product.productName}
                </Text>
                <Text style={styles.productsViewItemValue}>
                  {CurrencyConverter(product.balance)}
                  {currencies.GEL}
                </Text>
              </View>
              {userData.userProducts &&
                index != userData.userProducts.length - 1 && (
                  <View style={styles.productsViewItemLine}></View>
                )}
            </View>
          </View>
        ))
      )}
    </View>
  );

  const UnicardAction = (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={openUnicardSidebar}
      style={[styles.unicardActionContainer, shadowedCardConditionalClass]}>
      <View style={styles.unicardActionInnerLeft}>
        <View style={styles.unicardLogoBox}>
          <Image source={require('./../../assets/images/uniLogo.png')} />
        </View>
        <Text style={styles.unicardACtionText}>უნიქარდის ბარათი</Text>
      </View>
      <Image
        source={require('./../../assets/images/icon-right-arrow-green.png')}
      />
    </TouchableOpacity>
  );

  const offersView = (
    <View style={styles.offersContainer}>
      <View style={styles.offersContainerHeader}>
        <Text style={styles.offersContainerTitle}>ჩემი შეთავაზებები</Text>
        <PaginationDots step={offersStep} length={offers.length} />
      </View>
      <ScrollView
        onScroll={handleOffersScroll}
        style={styles.offersContainerScrollable}
        showsHorizontalScrollIndicator={false}
        horizontal={true}>
        {offers.map((offer, index) => (
          <View
            style={[
              styles.offersContainerItem,
              shadowedCardConditionalClass,
              {width: screenSize.width - 90},
              index === 0 && {marginLeft: 15},
            ]}
            key={`offer${index}`}>
            <Image
              source={offer.image}
              style={styles.offersContainerItemImage}
              resizeMode="cover"
            />
            <View style={styles.offersContainerItemDetails}>
              <Text style={styles.offersContainerItemDetailsTitle}>
                {offer.title}
              </Text>
              <Text style={styles.offersContainerItemDetailsSubTitle}>
                {offer.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const _routes = useNavigationState(state => state.routes);

  const transferToUni = () => {
    const currentRoute = _routes[_routes.length - 1].name;
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
      dispatch(FetchUserAccountStatements({}));
    });
  };

  const GetUserBlockedFunds = () => {
    setIsFundsLoading(true);
    UserService.getUserBlockedFunds().subscribe({
      next: Response => {
        console.log(Response.data.data?.funds);
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

  const GetRouteInfo = useCallback((e: any) => {
    console.log('logging here route state')
    const {index, routes} = e.data.state;
    const currentRoute = routes[index]?.name;

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
    RouteListener.current = props.navigation.addListener(
      'state',
      GetRouteInfo,
    );

    return () => {
      RouteListener.current?.remove();
    }
  }, []);

  const onRefresh = () => {
    FetchUserData();
  };

  useEffect(() => {
    NetworkService.CheckConnection(() => {
      if (!userData.userProducts?.length) dispatch(FetchUserProducts());
      if (!userData.userAccounts?.length) dispatch(FetchUserAccounts());
      if (!userData.userTotalBalance) dispatch(FetchUserTotalBalance());
      if (!userData.useAccountStatements)
        dispatch(FetchUserAccountStatements({}));
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

  useEffect(() => {
    GetUserBlockedFunds();
  }, []);

  const actionSHeetCloseDelay = debounce((e: Function) => e(), 1000);

  useEffect(() => {
    subscriptionService.getData().subscribe(data => {
      if (data?.key === SUBSCRIBTION_KEYS.OPEN_ACTIONS_ACTIONSHEET) {
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

  const sheetHeight = Dimensions.get('window').height - 20;
  const ActionsSheetHeight = 440;

  const allStatements = [...(userData.useAccountStatements?.statements || [])]

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
        <View style={[screenStyles.wraperWithShadow]}>
          <AccountStatusView onStartVerification={start_verification} />
        </View>
        <View style={screenStyles.wraper}>
          <CurrentMoney
            totalBalance={userData.userTotalBalance}
            isLoading={userData.isTotalBalanceLoading}
            containerStyle={styles.currentMoneyBox}
          />
        </View>
        <View style={screenStyles.wraperWithShadow}>{UnicardAction}</View>
        <View style={screenStyles.wraperWithShadow}>{productsView}</View>
        {offersView}
        <View style={screenStyles.wraper}>
          <TransactionsList
            statements={allStatements}
            funds={funds}
            isLoading={userData.isStatementsLoading || isFundsLoading}
            containerStyle={styles.transactionContainer}
          />
        </View>
      </ScrollView>

      <ActionSheetCustom
        header={verifiSheetHeader}
        scrollable={true}
        hasDraggableIcon={false}
        visible={isVerificationStart}
        hasScroll={true}
        height={sheetHeight}
        onPress={() => close_verification()}>
        <Verification
          sendHeader={setVerifySheetHeader}
          onReset={isVerificationStart}
          onClose={close_verification}
        />
      </ActionSheetCustom>

      <ActionSheetCustom
        header={actionsSheetHeader}
        scrollable={true}
        hasDraggableIcon={false}
        visible={actionsVisible}
        hasScroll={true}
        height={ActionsSheetHeight}
        onPress={closeActionSheet}>
        <Actions title="აირჩიეთ სერვისი" sendHeader={setActionsSheetHeader} />
      </ActionSheetCustom>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  accountStatusView: {
    marginTop: 20,
    minHeight: 46,
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'center',
  },
  accountStatusViewInner: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 13,
    flex: 1,
  },
  accountStatusViewTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  accountStatusViewSimbol: {
    width: 20,
    height: 20,
    marginRight: 30,
  },
  accountStatusViewText: {
    fontFamily: 'FiraGO-Book',
    fontSize: 15,
    lineHeight: 19,
    color: colors.black,
  },
  unicardACtionText: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
  },
  currentMoneyBox: {
    marginTop: 35,
    paddingHorizontal: 8,
  },
  productsViewContainer: {
    marginTop: 36,
    padding: 17,
    backgroundColor: colors.white,
  },
  unicardActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 36,
    padding: 17,
    backgroundColor: colors.white,
  },
  unicardActionInnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unicardLogoBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.inputBackGround,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productsViewTitle: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  productsViewSeeall: {
    fontFamily: 'FiraGO-Book',
    fontSize: 12,
    lineHeight: 15,
    color: colors.labelColor,
  },
  ProductsViewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  ProductsViewLastItem: {
    //marginTop: 34
  },
  productsItemRight: {
    flex: 1,
    position: 'relative',
  },
  productsItemRightInner: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productsViewLogo: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  productsViewItemTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
  },
  productsViewItemLine: {
    borderBottomColor: '#F5F5F5',
    borderBottomWidth: 1,
    flex: 1,
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
  },
  productsViewItemValue: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  offersContainer: {
    height: 188,
    flex: 1,
    marginTop: 33,
  },
  offersContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 18,
    paddingHorizontal: 22,
    marginBottom: 20,
  },
  offersContainerTitle: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  offersContainerScrollable: {},
  offersContainerItem: {
    overflow: 'hidden',
    height: 143,
    marginHorizontal: 9,
    backgroundColor: colors.white,
  },
  offersContainerItemImage: {
    width: '100%',
    height: 82,
  },
  offersContainerItemDetails: {
    height: 61,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  offersContainerItemDetailsTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 10,
    lineHeight: 12,
    color: colors.black,
  },
  offersContainerItemDetailsSubTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 9,
    lineHeight: 11,
    color: colors.labelColor,
    marginTop: 4,
  },
  transactionContainer: {
    marginBottom: 41,
    marginTop: 38,
  },
  loadingBox: {
    alignSelf: 'center',
    flex: 1,
    marginTop: 10,
  },
});

export default Dashboard;
