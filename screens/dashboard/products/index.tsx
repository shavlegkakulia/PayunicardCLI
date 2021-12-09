import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Text,
  Image,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  ActivityIndicator,
  TouchableWithoutFeedback,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import Routes from '../../../navigation/routes';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import NetworkService from '../../../services/NetworkService';
import screenStyles from '../../../styles/screens';
import DashboardLayout from '../../DashboardLayout';
import CurrentMoney from './../currentMoney';
import UserService, {
  IAccountBallance,
  ICancelPackageWEBRequest,
  ICardStatus,
  ICurrency,
  IGetCardListWEBResponse,
  IGetUserBankCardsResponse,
} from '../../../services/UserService';
import {
  CurrencyConverter,
  CurrencySimbolConverter,
  getNumber,
  getString,
} from '../../../utils/Converter';
import {CURRENCY_DETAILS, EUR, GEL, USD} from '../../../constants/currencies';
import {TYPE_UNICARD} from '../../../constants/accountTypes';
import {FetchUserAccounts} from '../../../redux/actions/user_actions';
import Clipboard from '@react-native-community/clipboard';
import {debounce, formatDate} from '../../../utils/utils';
import NavigationService from '../../../services/NavigationService';
import TemporaryText from '../../../components/TemporaryText';
import {tabHeight} from '../../../navigation/TabNav';
import PaginationDots from '../../../components/PaginationDots';
import {cardTypeIds} from '../cardsStore/TarriffCalculator';
import userStatuses from '../../../constants/userStatuses';

interface IAccountCardProps {
  account: IAccountBallance;
  cardMask?: string;
  inGroup?: boolean;
  goLayerUp?: boolean;
  cardContainerStyle?: StyleProp<ViewStyle>;
  logo?: ImageSourcePropType;
  onDetailView?: Function;
}

interface IOrderedCardProps {
  card: ICardStatus;
  width: number | string | undefined;
  onCancelPackageWEB: (GroupId: number, OrderingCardId: number) => void;
}

const PACKET_TYPE_IDS = {
  wallet: 1,
  upera: 2,
  uniPlus: 3,
  uniUltra: 4,
  unicard: TYPE_UNICARD,
};

export const OrderedCard: React.FC<IOrderedCardProps> = props => {
  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const {documentVerificationStatusCode, customerVerificationStatusCode} =
    userData.userDetails || {};
  const isUserVerified =
    documentVerificationStatusCode === userStatuses.Enum_Verified &&
    customerVerificationStatusCode === userStatuses.Enum_Verified;
  return (
    <View style={{width: props.width, marginLeft: 15}}>
      <View
        style={[
          styles.accountCardWallet,
          props.card.cardTypeID === PACKET_TYPE_IDS.unicard &&
            styles.accountCardUnicard,
          props.card.cardTypeID === PACKET_TYPE_IDS.uniUltra &&
            styles.accountUnicard,
          props.card.cardTypeID === PACKET_TYPE_IDS.upera &&
            styles.accountCardUpera,
          {width: '100%'},
        ]}>
        {props.card.cardTypeID !== PACKET_TYPE_IDS.unicard && (
          <>
            <Image
              source={
                props.card.cardTypeID === PACKET_TYPE_IDS.wallet
                  ? require('./../../../assets/images/cardCornerGray.png')
                  : props.card.cardTypeID === PACKET_TYPE_IDS.uniUltra
                  ? require('./../../../assets/images/cardCornerPrimary.png')
                  : props.card.cardTypeID === PACKET_TYPE_IDS.upera
                  ? require('./../../../assets/images/cardCornerPrimary.png')
                  : require('./../../../assets/images/cardCornerOrange.png')
              }
              style={styles.cardCorner}
            />
            <Image
              source={require('./../../../assets/images/x-5x5.png')}
              style={styles.x}
            />
          </>
        )}
        <TouchableOpacity activeOpacity={0.8}>
          <View>
            <Text style={styles.cardTitle}>
              {props.card.packagecode}****
              {props.card.status === 0
                ? 'წინასწარი შეკვეთა'
                : 'შეკვეთილი ბარათი'}
            </Text>
          </View>
          <View style={[styles.cardCurrencies]}>
            <View>
              <View style={styles.cardBalanceContainer}>
                <Text style={styles.cardBallance}>
                  {CurrencyConverter(props.card.amount)}
                  {CurrencySimbolConverter(GEL)}
                </Text>
              </View>
              <View style={styles.cardCurrencyBalance}>
                <TouchableOpacity activeOpacity={1}>
                  <Text style={styles.cardCurrency}>
                    {CurrencySimbolConverter(GEL)} {CurrencyConverter(0)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1}>
                  <Text style={styles.cardCurrency}>
                    {CurrencySimbolConverter(USD)} {CurrencyConverter(0)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1}>
                  <Text style={styles.cardCurrency}>
                    {CurrencySimbolConverter(EUR)} {CurrencyConverter(0)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Image
                source={require('./../../../assets/images/verticall-dots.png')}
              />
            </View>
          </View>
          <View style={styles.cardAccountContainer}>
            <View style={styles.cardContainerInner}>
              <>
                <Text style={styles.orderedCardAmount}>
                  სულ გადასახდელი:{' '}
                  <Text style={styles.bolder}>
                    {CurrencyConverter(props.card.amount)}{' '}
                    {CurrencySimbolConverter(GEL)}
                  </Text>
                </Text>

                <Text style={styles.orderedCardCancellation}>
                  შეკვეთის გაუქმების თარიღი:{' '}
                  <Text style={styles.bolder}>
                    {formatDate(props.card.orderCancelDate?.toString())
                      .split('.')
                      .join('/')
                      .toString()}
                    , 00:00 საათი
                  </Text>{' '}
                </Text>
              </>
            </View>
            <View style={styles.cardLogoContainer}>
              {props.card.cardTypeID === cardTypeIds.typeVisa ? (
                <Image
                  source={require('./../../../assets/images/visa_35x14.png')}
                />
              ) : (
                <Image
                  source={require('./../../../assets/images/mastercard_24x15.png')}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {!isUserVerified && (
        <View style={styles.notVerifiedBlock}>
          <Image
            source={require('./../../../assets/images/alert_red.png')}
            resizeMode="contain"
            style={styles.notVerifiedAlertIcon}
          />
          <Text style={styles.notVerifiedBlockText}>
            ბარათის მისაღებად გთხოვთ{'\n'}გაიაროთ იდენტიფიკაცია
          </Text>
        </View>
      )}
    </View>
  );
};

export const AccountCard: React.FC<IAccountCardProps> = props => {
  const [outer, setOuter] = useState(true);
  const [copiedText, setCopiedText] = useState<string | undefined>();
  const copiedTextTtl = useRef<NodeJS.Timeout>();
  const clickPropagationDebounce = debounce((e: Function) => e(), 500);

  const goDetail = () => {
    setOuter(true);
    clickPropagationDebounce(() => {
      if (outer) {
        props.onDetailView && props.onDetailView();
      }
    });
  };

  const copyToClipboard = (str: string) => {
    setOuter(false);
    Clipboard.setString(str);
    setCopiedText(str);
    copiedTextTtl.current = setTimeout(() => {
      setCopiedText(undefined);
    }, 1000);
  };

  const getAvailableBalanceByPrioritiCCY = () => {
    const accounts = {...props.account};
    const priorityBalance = accounts.currencies?.filter(
      currency => currency.key === props.account.ccyPriority,
    );

    return priorityBalance?.length ? priorityBalance[0].availableBal : 0;
  };

  return (
    <View
      style={[
        styles.accountCardWallet,
        props.account.type === PACKET_TYPE_IDS.unicard &&
          styles.accountCardUnicard,
        props.account.type === PACKET_TYPE_IDS.uniUltra &&
          styles.accountUnicard,
        props.inGroup && styles.accountInGroup,
        props.goLayerUp && styles.accountInGroupUpper,
        props.account.type === PACKET_TYPE_IDS.uniPlus && {
          ...styles.accountUnicard,
        },
        props.account.type === PACKET_TYPE_IDS.upera && styles.accountCardUpera,
        props.cardContainerStyle,
      ]}>
      {props.account.type !== PACKET_TYPE_IDS.unicard && (
        <Image
          source={
            props.account.type === PACKET_TYPE_IDS.wallet
              ? require('./../../../assets/images/cardCornerGray.png')
              : props.account.type === PACKET_TYPE_IDS.uniUltra
              ? require('./../../../assets/images/cardCornerPrimary.png')
              : props.account.type === PACKET_TYPE_IDS.upera
              ? require('./../../../assets/images/cardCornerPrimary.png')
              : require('./../../../assets/images/cardCornerOrange.png')
          }
          style={styles.cardCorner}
        />
      )}
      <TouchableOpacity onPress={goDetail} activeOpacity={0.8}>
        <View>
          <Text style={styles.cardTitle}>
            {props.account.type === PACKET_TYPE_IDS.wallet
              ? 'wallet'
              : props.account.accountTypeName}
            {' ' + (props.cardMask || '')}
            {/* {props.account?.cards ? props.account.cards[0].status:'0'} */}
          </Text>
        </View>
        <View
          style={[
            styles.cardCurrencies,
            props.account.type === PACKET_TYPE_IDS.unicard &&
              styles.cardCurrenciesUnicard,
          ]}>
          <View>
            <View style={styles.cardBalanceContainer}>
              <Text style={styles.cardBallance}>
                {CurrencyConverter(getAvailableBalanceByPrioritiCCY())}
                {CurrencySimbolConverter(props.account.ccyPriority)}
              </Text>
              {props.account.type === PACKET_TYPE_IDS.unicard && (
                <Image
                  source={require('./../../../assets/images/score-star.png')}
                  style={styles.cardUniStar}
                />
              )}
            </View>
            {props.account.type !== PACKET_TYPE_IDS.unicard && (
              <View style={styles.cardCurrencyBalance}>
                {props.account.currencies?.map(currency => (
                  <TouchableOpacity key={currency.key}>
                    <Text style={styles.cardCurrency}>
                      {currency.value} {CurrencyConverter(currency.balance)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View>
            {props.account.type !== PACKET_TYPE_IDS.unicard &&
              props.account.type !== PACKET_TYPE_IDS.wallet &&
              getNumber(props.account.cards?.length) > 1 && (
                <Text
                  style={[
                    styles.cardAccountCount,
                    props.account.type === PACKET_TYPE_IDS.upera &&
                      styles.colorPrimary,
                  ]}>
                  {props.account.cards?.length}
                </Text>
              )}
            <Image
              source={require('./../../../assets/images/verticall-dots.png')}
            />
          </View>
        </View>
        <View style={styles.cardAccountContainer}>
          <View style={styles.cardContainerInner}>
            <TouchableWithoutFeedback>
              <TouchableOpacity
                style={styles.cardAccountInfo}
                onPress={() =>
                  copyToClipboard(getString(props.account.accountNumber))
                }>
                <Text style={styles.cardAccount}>
                  {props.account.type === TYPE_UNICARD
                    ? props.account.accountNumber?.replace(
                        /\b(\d{4})(\d{4})(\d{4})(\d{4})\b/,
                        '$1  $2  $3  $4',
                      )
                    : props.account.accountNumber}
                </Text>
                {props.account.type !== PACKET_TYPE_IDS.unicard && (
                  <Image
                    source={require('./../../../assets/images/textCopyIcon.png')}
                    style={styles.cardAccountCopy}
                  />
                )}
                <TemporaryText
                  text="დაკოპირდა"
                  show={props.account.accountNumber === copiedText}
                />
              </TouchableOpacity>
            </TouchableWithoutFeedback>
          </View>
          <View>
            {props.logo ? (
              <Image
                source={props.logo}
                resizeMode="contain"
                style={styles.packetLogo}
              />
            ) : props.account.type === PACKET_TYPE_IDS.unicard ? (
              <Image source={require('./../../../assets/images/uniLogo.png')} />
            ) : (
              <Image
                source={{uri: props.account.imageUrl}}
                resizeMode="contain"
                style={styles.packetLogo}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Products: React.FC = props => {
  const [refreshing, setRefreshing] = useState(false);
  const [orderedsLoading, setOrderedsLoading] = useState(false);
  const [addedCardsLoading, setAddedCardsLoading] = useState(true);
  const [orderedsStep, setOrderedsStep] = useState<number>(0);
  const [orderedCards, setOrderedCards] = useState<
    IGetCardListWEBResponse | undefined
  >();
  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const [activeAccounts, setActiveAccounts] = useState<
    IAccountBallance[] | undefined
  >();
  const [userBankCards, setUserBankCards] = useState<
    IGetUserBankCardsResponse | undefined
  >();
  const [BankCardScrollWIdth, setBankCardScrollWIdth] = useState<
    number | string | undefined
  >();
  const dispatch = useDispatch();
  const screenSize = Dimensions.get('window');

  const fetchAccounts = () => {
    NetworkService.CheckConnection(() => {
      dispatch(FetchUserAccounts());
      console.log('FETCH_USER_ACCOUNTS', 'Products');
    });
  };

  const AddBankCard = () => {
    NavigationService.navigate(Routes.addBankCard);
  };

  const handleOrderedsScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    let overView = event.nativeEvent.contentOffset.x / (screenSize.width - 25);
    setOrderedsStep(Math.round(overView));
  };

  const onScrollLayout = (event: any) => {
    const {width} = event.nativeEvent.layout;

    setBankCardScrollWIdth(width);
    setAddedCardsLoading(false);
  };

  const CancelPackageWEB = (GroupId: number, OrderingCardId: number) => {
    const data: ICancelPackageWEBRequest = {
      groupId: GroupId,
      orderingCardId: OrderingCardId,
    };
    setOrderedsLoading(true);
    UserService.CancelPackageWEB(data).subscribe({
      next: Response => {
        if (Response.data.ok) {
          GetOrderedCards();
        }
      },
      error: () => {
        setOrderedsLoading(false);
      },
    });
  };

  const GetOrderedCards = () => {
    setOrderedsLoading(true);
    UserService.getCardListWEB(
      getNumber(userData.userDetails?.customerID),
    ).subscribe({
      next: Response => {
        if (Response.data.ok) {
          let _orderedCards: IGetCardListWEBResponse = {
            cardStatuses: [...(Response.data.data?.cardStatuses || [])],
          };
          let tempOrder: any = [];
          _orderedCards?.cardStatuses?.forEach(card => {
            if (card.paketTypeId == 0) {
              card.paketTypeId = card.coPaketTypeId;
            }
            if (!card?.packagecode) {
              let filteredAcc = userData?.userAccounts?.filter(
                acc => acc.customerPaketId === card.paketTypeId,
              );
              if (filteredAcc?.length) {
                card.packagecode = filteredAcc[0].accountTypeName;
                card.accountNumber = filteredAcc[0].accountNumber;
              }
            }
            let element = tempOrder.find(
              (order: {groupId: number | undefined}) =>
                order.groupId === card.groupId,
            );
            if (!element) {
              tempOrder.push(card);
            }
          });
          _orderedCards.cardStatuses = tempOrder;
          setOrderedCards(_orderedCards);
        }
        console.log(orderedCards);
      },
      complete: () => setOrderedsLoading(false),
      error: () => setOrderedsLoading(false),
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    NetworkService.CheckConnection(
      () => {
        fetchAccounts();
      },
      () => {
        setRefreshing(false);
      },
    );
  };

  useEffect(() => {
    if (!userData.isAccountsLoading) {
      setRefreshing(false);
    }
  }, [userData.isAccountsLoading]);

  useEffect(() => {
    let userAccounts = [...(userData?.userAccounts || [])];
    let activeCards = userAccounts.filter(account => {
      let Account = {...account};
      let cards = Account.cards?.filter(card => card.status === 1);
      account.cards = cards;
      return account;
    });
    setActiveAccounts(activeCards);

    let DetailCurrencies: ICurrency[] = [];
    userAccounts
      .filter(uc => uc.type != TYPE_UNICARD)
      .forEach(account => {
        account.currencies?.forEach(currency => {
          let isContaine =
            DetailCurrencies.filter(dc => dc.value === currency.value).length >
            0;
          if (!isContaine) {
            currency.title = getString(
              CURRENCY_DETAILS['ka'].filter(l => l.value == currency.key)[0]
                ?.title,
            );

            DetailCurrencies.push(currency);
          }
        });
      });
  }, [userData.userAccounts]);

  useEffect(() => {
    UserService.GetUserBankCards().subscribe({
      next: Response => {
        setUserBankCards(Response.data.data);
      },
      error: () => {},
    });
  }, []);

  useEffect(() => {
    if (userData.userDetails) {
      GetOrderedCards();
    }
  }, [userData.userDetails]);

  const addedCardWidth = getNumber(BankCardScrollWIdth) / 3;

  return (
    <DashboardLayout>
      <ScrollView
        style={screenStyles.screenContainer}
        contentContainerStyle={styles.avoid}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={colors.white}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <View style={screenStyles.wraper}>
          <CurrentMoney
            totalBalance={userData.userTotalBalance}
            isLoading={userData.isTotalBalanceLoading}
            containerStyle={styles.currentMoneyBox}
          />
        </View>
        <View style={screenStyles.wraperWithShadow}>
          <View
            style={[
              styles.productsViewContainer,
              screenStyles.shadowedCardbr15,
            ]}>
            <View style={styles.productsViewHeader}>
              <Text style={styles.productsViewTitle}>
                აქტიური ბარათები და ანგარიშები
              </Text>
            </View>
            {userData.isAccountsLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.loadingBox}
              />
            ) : (
              <>
                {activeAccounts?.map(account =>
                  getNumber(account.cards?.length) > 1 ? (
                    <View
                      style={styles.accountGroup}
                      key={account.accountNumber}>
                      <AccountCard account={account} inGroup />
                      <AccountCard
                        account={account}
                        goLayerUp
                        onDetailView={() =>
                          NavigationService.navigate(Routes.ProductDetail, {
                            account: account,
                          })
                        }
                      />
                    </View>
                  ) : (
                    <AccountCard
                      key={account.accountNumber}
                      account={account}
                      onDetailView={() =>
                        NavigationService.navigate(Routes.ProductDetail, {
                          account: account,
                        })
                      }
                    />
                  ),
                )}
              </>
            )}
          </View>
        </View>

        <View style={screenStyles.wraperWithShadow}>
          <View
            style={[styles.addedCardsContainer, screenStyles.shadowedCardbr15]}>
            <View style={styles.productsViewHeader}>
              <Text style={styles.productsViewTitle}>დამატებული ბარათები</Text>
            </View>
            <ScrollView
              style={styles.addedCadsContainer}
              onLayout={event => onScrollLayout(event)}
              showsHorizontalScrollIndicator={false}
              horizontal={true}>
              {!addedCardsLoading && (
                <>
                  <View style={[styles.addedCardBox, {width: addedCardWidth}]}>
                    <View style={[styles.addedCard, styles.addedCard3]}>
                      <TouchableOpacity
                        style={styles.addCardPressable}
                        onPress={AddBankCard.bind(this)}>
                        <Image
                          source={require('./../../../assets/images/plus_noBG.png')}
                          resizeMode="contain"
                          style={styles.addedCardIcon}
                        />
                        <Text style={styles.addedCardText}>
                          ბარათის დამატება
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {userBankCards?.bankCards?.map(bankCard => (
                    <View
                      key={bankCard.cardId}
                      style={[styles.addedCardBox, {width: addedCardWidth}]}>
                      <View
                        style={[styles.addedCard, styles.addedCard1]}
                        key={bankCard.cardId}>
                        <TouchableOpacity style={styles.addCardPressable}>
                          <Image
                            source={
                              bankCard.cardType === PACKET_TYPE_IDS.uniUltra
                                ? require('./../../../assets/images/visa_big.png')
                                : require('./../../../assets/images/mastercard_big.png')
                            }
                            resizeMode="contain"
                            style={styles.addedCardIcon}
                          />
                          <Text style={styles.addedCardText}>
                            {bankCard.cardNumber}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </View>

        {getNumber(orderedCards?.cardStatuses?.length) > 0 && !orderedsLoading && (
          <View style={styles.orderedContainer}>
            <View style={styles.orderedContainerHeader}>
              <Text style={styles.offersContainerTitle}>
                შეკვეთილი ბარათები
              </Text>
              {getNumber(orderedCards?.cardStatuses?.length) > 1 && (
                <PaginationDots
                  step={orderedsStep}
                  length={orderedCards?.cardStatuses?.length}
                />
              )}
            </View>

            <ScrollView
              onScroll={handleOrderedsScroll}
              contentContainerStyle={[
                styles.orderedContainerScrollable,
                orderedCards?.cardStatuses?.length === 1 && {width: '100%'},
              ]}
              showsHorizontalScrollIndicator={false}
              horizontal={true}>
              {orderedsLoading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={styles.loadingBox}
                />
              ) : (
                orderedCards?.cardStatuses?.map((card, index) => (
                  <OrderedCard
                    key={index}
                    card={card}
                    onCancelPackageWEB={CancelPackageWEB}
                    width={
                      orderedCards?.cardStatuses?.length === 1
                        ? '100%'
                        : BankCardScrollWIdth
                    }
                  />
                ))
              )}
            </ScrollView>
          </View>
        )}
        {/* <View style={[screenStyles.wraperWithShadow, styles.bankDetailSection]}>
          <View
            style={[
              styles.productsViewContainer,
              screenStyles.shadowedCardbr15,
            ]}>
            <View style={styles.productsViewHeader}>
              <Text style={styles.productsViewTitle}>საფულის შევსება</Text>
            </View>

            <Text style={styles.sectionTitle}>საბანკო რეკვიზიტები</Text>

            <View style={styles.bankDetails}>
              {detailCurrencies?.map(currency => (
                <View style={styles.bankDetailsItem} key={currency.key}>
                  <View style={styles.bankDetailCardLeftItem}>
                    <View style={styles.bankDetailCardCurrencyBox}>
                      <Text style={styles.bankDetailCardCurrency}>
                        {CurrencySimbolConverter(currency.value)}
                      </Text>
                    </View>
                    <Text style={styles.bankDetailCardCurrencyValue}>
                      {currency.title}
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity>
                      <Image
                        source={require('./../../../assets/images/downloadIcon18x22.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>ბარათით</Text>

            <View style={styles.otherDetailContainer}>
              <View style={styles.otherDetailVisaMc}>
                <Image
                  source={require('./../../../assets/images/visa_big.png')}
                  style={styles.otherDetailVisa}
                />
                <Image
                  source={require('./../../../assets/images/mastercard_big.png')}
                />
              </View>
              <View style={styles.otherDetail}>
                <View>
                  <Text style={styles.otherDetailItem}>*საკომისიო:</Text>
                </View>
                <View>
                  <Text style={styles.otherDetailItem}>
                    ქართული ბანკის ბარათი - 15% - 2%
                  </Text>
                </View>
                <View>
                  <Text style={styles.otherDetailItem}>
                    უცხოური ბანკის ბარათი - 2.5%
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>სწრაფი გადახდის აპარატებით</Text>

            <View style={styles.terminals}>
              <View style={styles.terminalItemContainer}>
                <View style={styles.terminalItem}>
                  <Image
                    source={{uri: `${envs.CDN_PATH}payment_icons/tbcpay.png`}}
                    resizeMode="contain"
                    style={styles.terminalLogo}
                  />
                </View>
              </View>

              <View style={styles.terminalItemContainer}>
                <View style={styles.terminalItem}>
                  <Image
                    source={{uri: `${envs.CDN_PATH}payment_icons/oppapay.png`}}
                    resizeMode="contain"
                    style={styles.terminalLogo}
                  />
                </View>
              </View>

              <View style={styles.terminalItemContainer}>
                <View style={styles.terminalItem}>
                  <Image
                    source={{uri: `${envs.CDN_PATH}payment_icons/vtbpay.png`}}
                    resizeMode="contain"
                    style={styles.terminalLogo}
                  />
                </View>
              </View>
            </View>
          </View>
        </View> */}
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  avoid: {
    paddingBottom: tabHeight,
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
  addedCardsContainer: {
    marginTop: 20,
    paddingVertical: 17,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  productsViewHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
  },
  productsViewTitle: {
    fontFamily: 'FiraGO-Bold',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    marginLeft: 5,
  },
  transfersAll: {
    paddingRight: 0,
  },
  transfersAllText: {
    fontFamily: 'FiraGO-Book',
    fontSize: 12,
    lineHeight: 15,
    color: colors.labelColor,
  },
  accountCardWallet: {
    borderWidth: 1,
    borderColor: colors.cardBorderColor,
    borderRadius: 7,
    padding: 13,
    position: 'relative',
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  accountCardUpera: {
    borderColor: colors.primary,
  },
  accountCardUnicard: {
    borderColor: colors.uniColor,
  },
  accountUnicard: {
    borderColor: colors.uniColor,
  },
  accountUniPlus: {
    borderColor: colors.uniColor,
  },
  accountInGroup: {
    position: 'absolute',
    top: -5,
    right: -5,
    left: 5,
    bottom: 5,
    zIndex: 1,
  },
  accountInGroupUpper: {
    zIndex: 9,
  },
  closeAction: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    backgroundColor: 'red',
  },
  cardCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  cardTitle: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
  },
  cardCurrencies: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  cardCurrenciesUnicard: {
    marginTop: 30,
  },
  cardBallance: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 24,
    lineHeight: 29,
    color: colors.black,
  },
  cardCurrencyBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  cardCurrency: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 12,
    lineHeight: 14,
    color: colors.labelColor,
    marginRight: 13,
  },
  cardAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cardContainerInner: {
    flex: 1,
  },
  cardAccountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardAccount: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    marginRight: 5,
  },
  cardAccountCopy: {
    width: 12,
    height: 12,
  },
  cardBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardUniStar: {
    marginLeft: 6,
  },
  cardAccountCount: {
    fontFamily: 'FiraGO-Book',
    fontSize: 12,
    lineHeight: 15,
    color: colors.uniColor,
    position: 'relative',
    right: 2,
    marginBottom: 4,
  },
  colorPrimary: {
    color: colors.primary,
  },
  accountGroup: {
    position: 'relative',
  },
  sectionTitle: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 18,
    color: colors.black,
  },
  addedCadsContainer: {
    flexDirection: 'row',
  },
  addedCardBox: {
    width: '33.3333333333%',
    paddingHorizontal: 5,
  },
  addedCard: {
    borderColor: colors.cardBorderColor,
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    minHeight: 80,
  },
  addedCard1: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  addedCard2: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  addedCard3: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardPressable: {
    alignItems: 'center',
  },
  addedCardIcon: {
    height: 20,
  },
  addedCardText: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 12,
    lineHeight: 14,
    marginTop: 4,
    color: colors.labelColor,
  },
  bankDetails: {
    marginTop: 23,
  },
  bankDetailsItem: {
    marginBottom: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankDetailCardLeftItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankDetailCardCurrencyBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.inputBackGround,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankDetailCardCurrency: {
    color: colors.primary,
    fontFamily: 'FiraGO-Regular',
    fontSize: 16,
  },
  bankDetailCardCurrencyValue: {
    color: colors.black,
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    marginLeft: 15,
  },
  otherDetailContainer: {
    marginTop: 23,
  },
  otherDetailVisaMc: {
    flexDirection: 'row',
  },
  otherDetailVisa: {
    marginRight: 20,
  },
  otherDetail: {
    marginTop: 10,
  },
  otherDetailItem: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 15,
    lineHeight: 15,
    color: colors.labelColor,
    marginBottom: 4,
  },
  terminals: {
    flexDirection: 'row',
  },
  terminalItemContainer: {
    overflow: 'hidden',
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  terminalItem: {
    backgroundColor: '#fff',
    width: 70,
    height: 40,
    marginBottom: 5,
    marginRight: 25,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 7,
    borderRadius: 7,
    elevation: 5,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankDetailSection: {
    marginBottom: 30,
  },
  packetLogo: {
    height: 18,
    width: 30,
  },
  terminalLogo: {
    width: 30,
    height: 20,
  },
  loadingBox: {
    alignSelf: 'center',
    flex: 1,
    marginTop: 10,
  },
  orderedContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: tabHeight,
  },
  orderedContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 18,
    paddingHorizontal: 22,
    marginBottom: 20,
  },
  orderedContainerScrollable: {
    paddingRight: 30,
  },
  offersContainerTitle: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  orderedCardAmount: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 8,
    lineHeight: 10,
    color: colors.black,
  },
  orderedCardCancellation: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 8,
    lineHeight: 16,
    color: colors.black,
    marginTop: 2,
  },
  bolder: {
    fontWeight: '700',
  },
  cardLogoContainer: {
    justifyContent: 'flex-end',
  },
  x: {
    position: 'absolute',
    right: 4,
    top: 4,
  },
  notVerifiedAlertIcon: {
    width: 30,
    height: 30,
  },
  notVerifiedBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notVerifiedBlockText: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 9,
    lineHeight: 12,
    color: colors.black,
    marginLeft: 8,
  },
});

export default Products;
