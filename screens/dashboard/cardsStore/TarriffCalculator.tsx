import {RouteProp, useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {StoreActionType} from '.';
import AccountSelect, {
  AccountItem,
} from '../../../components/AccountSelect/AccountSelect';
import AppButton from '../../../components/UI/AppButton';
import {TYPE_UNICARD} from '../../../constants/accountTypes';
import colors from '../../../constants/colors';
import CardTab from '../../../containers/TarrifAndCard/CardTab';
import Routes from '../../../navigation/routes';
import {tabHeight} from '../../../navigation/TabNav';
import {PUSH} from '../../../redux/actions/error_action';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import CardService, {
  IGetCardOrderingTariffAmountRequest,
  IGetCardOrderingTariffAmountResponse,
} from '../../../services/CardService';
import NavigationService from '../../../services/NavigationService';
import PresentationServive, {
  ICardType,
  IPackage,
  IPackageCard,
} from '../../../services/PresentationServive';
import {IAccountBallance} from '../../../services/UserService';
import screenStyles from '../../../styles/screens';
import {CurrencyConverter, getNumber} from '../../../utils/Converter';
import {Periodes} from './choosePlane';

type RouteParamList = {
  params: {
    package: IPackage;
    tarrif: IPackageCard;
    packageCardTypes: IPackageCard[] | undefined;
    activePeriod: string;
    orderType: string;
    period: string;
  };
};

export const cardTypeIds = {
  typeVisa: 1,
  typeMc: 2,
};

export const PacketTypeIds = {
  UPERA: 2,
  UnicardPlus: 3,
  UnicardUltra: 4,
};

const TarriffCalculator: React.FC = props => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fromAccountVisible, setFromAccountVisible] = useState(false);
  const [selectedFromAccount, setselectedFromAccount] = useState<
    IAccountBallance | undefined
  >();
  const [fromAccountErrorStyle, setFromAccountErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [isEnabled, setIsEnabled] = useState(true);
  const [accounts, setAccounts] = useState<IAccountBallance[] | undefined>();
  const [cardTypes, setCardTypes] = useState<ICardType[] | undefined>();
  const [cardTarrif, setCardTarrif] =
    useState<IGetCardOrderingTariffAmountResponse>();
  const [{visaCount, mcCount}, setMcVisaCount] = useState({
    visaCount: 0,
    mcCount: 0,
  });
  const dispatch = useDispatch();

  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;

  const cardCount = (cardTypes || []).reduce(function (t1, obj) {
    return t1 + getNumber(obj.willCount);
  }, 0);

  const toggleHrmSwitch = () => setIsEnabled(previousState => !previousState);

  const onFromAccountSelect = (account: IAccountBallance) => {
    setselectedFromAccount(account);
    setFromAccountVisible(!fromAccountVisible);
  };

  const getTarrif = (CardTypes?: ICardType[] | undefined) => {
    let data: IGetCardOrderingTariffAmountRequest = {
      T1Q:
        (CardTypes || cardTypes)
          ?.filter(t => t.typeId === cardTypeIds.typeVisa)[0]
          .willCount?.toString() || '0',
      T2Q:
        (CardTypes || cardTypes)
          ?.filter(t => t.typeId === cardTypeIds.typeMc)[0]
          .willCount?.toString() || '0',
    };

    if (selectedFromAccount?.accountNumber) {
      data = {...data, accountNumberCH: selectedFromAccount?.accountNumber};
    }

    CardService.getCardOrderingTariffAmount(data).subscribe({
      next: Response => {
        setCardTarrif(Response.data.data);
      },
      complete: () => {},
      error: err => {
        console.log(err);
      },
    });
  };

  const cardToggle = (card: ICardType) => {
    const c = [...(cardTypes || [])];
    const index = c.findIndex(cd => cd.name === card.name);
    if (c[index].isChecked) {
      c[index].willCount = 0;
    }
    c[index].isChecked = !c[index].isChecked;
    setCardTypes(c);

    if (!card.willCount && c[index].isChecked) {
      setCardsCount(card, '+');
    }
    if (route.params.activePeriod) getTarrif();
  };

  const setCardsCount = (card: ICardType, operation: string = '+') => {
    const c = [...(cardTypes || [])];
    const index = c.findIndex(cd => cd.name === card.name);

    if (route.params.activePeriod) {
      const period = route.params.activePeriod;

      if (period === Periodes.Quarter) {
        if (route.params.package.paketTypeId === PacketTypeIds.UnicardPlus) {
          c.map(pt => {
            if (pt.typeId === card.typeId) {
              pt.willCount = 1;
            } else {
              pt.willCount = 0;
              pt.isChecked = false;
            }
            return pt;
          });
        }

        if (route.params.package.paketTypeId === PacketTypeIds.UnicardUltra) {
          c.map(pt => {
            if (pt.typeId === card.typeId) {
              if (operation === '+') {
                pt.willCount = 1;
              } else {
                pt.willCount = 0;
                pt.isChecked = false;
              }
            }
            return pt;
          });
        }
      } else if (period === Periodes.Year) {
        if (route.params.package.paketTypeId === PacketTypeIds.UPERA) {
          c.map(pt => {
            if (pt.typeId === card.typeId) {
              pt.willCount = 1;
            } else {
              pt.willCount = 0;
              pt.isChecked = false;
            }
            return pt;
          });
        } else if (
          route.params.package.paketTypeId === PacketTypeIds.UnicardPlus
        ) {
          c.map(pt => {
            if (pt.typeId === card.typeId) {
              pt.willCount = 1;
            } else {
              pt.willCount = 0;
              pt.isChecked = false;
            }
            return pt;
          });
        } else if (
          route.params.package.paketTypeId === PacketTypeIds.UnicardUltra
        ) {
          c.map(pt => {
            if (pt.typeId === card.typeId) {
              if (operation === '+') {
                pt.willCount = 1;
              } else {
                pt.willCount = 0;
                pt.isChecked = false;
              }
            }
            return pt;
          });
        }
      }

      getTarrif(c);
      setCardTypes(c);
      return;
    }

    if (operation === '-' && getNumber(c[index].willCount) === 1) {
      c[index].isChecked = false;
    }

    if (operation === '-' && getNumber(c[index].willCount) <= 0) {
      return;
    }

    if (visaCount + mcCount + cardCount >= 6 && operation === '+') {
      if (getNumber(c[index].willCount) <= 0) {
        c[index].isChecked = false;
        setCardTypes(c);
      }
      dispatch(
        PUSH(
          `თქვენ შეგიძლიათ შეგვიკვეთოთ 6 ბარათი. თქვენ შეკვეთილი გაქვთ ${
            visaCount + mcCount
          } ბარათი`,
        ),
      );
      return;
    }

    if (card.typeId === cardTypeIds.typeVisa && operation === '+') {
      if (visaCount + getNumber(card.willCount) >= 2) {
        if (getNumber(c[index].willCount) <= 0) {
          c[index].isChecked = false;
          setCardTypes(c);
        }
        dispatch(
          PUSH(
            `თქვენ შეგიძლიათ შეგვიკვეთოთ 6 ბარათი. თქვენ შეკვეთილი გაქვთ ${cardCount} ბარათი`,
          ),
        );
        return;
      }
    }

    if (operation === '+') {
      c[index].willCount = getNumber(c[index].willCount) + 1;
    } else {
      c[index].willCount = getNumber(c[index].willCount) - 1;
    }
    getTarrif(c);
    setCardTypes(c);
  };

  const next = () => {
    if (
      !selectedFromAccount &&
      route.params.orderType === StoreActionType.PurchaseCard
    ) {
      setFromAccountErrorStyle({
        borderColor: colors.danger,
        borderWidth: 1,
      });
      return;
    } else {
      setFromAccountErrorStyle({});
    }

    if (route.params.orderType === StoreActionType.PurchaseCard) {
      const isChoosed = cardTypes?.filter(
        ct => ct.willCount && ct.willCount > 0,
      );
      if (getNumber(isChoosed?.length) <= 0) {
        dispatch(PUSH('გთხოვთ აირჩიეთ ბარათი'));
        return;
      }
    }

    NavigationService.navigate(Routes.DelyveryMethods, {
      package: route.params.package,
      tarrif: route.params.tarrif,
      packageCardTypes: route.params.packageCardTypes,
      cardTypes: cardTypes,
      cardTarrif: cardTarrif,
      hrm: isEnabled,
      orderType: route.params.orderType,
      selectedFromAccount: selectedFromAccount?.accountNumber,
      period: route.params.period,
    });
  };

  useEffect(() => {
    setIsLoading(true);
    PresentationServive.getCardTypes().subscribe({
      next: Response => {
        const ctypes = [...(Response.data.data?.cardTypes || [])];
        let vc = ctypes.filter(ct => ct.typeId === cardTypeIds.typeVisa)[0];
        let mc = ctypes.filter(ct => ct.typeId === cardTypeIds.typeMc)[0];
        setMcVisaCount({
          visaCount: getNumber(vc.count),
          mcCount: getNumber(mc.count),
        });
        setCardTypes(ctypes);
      },
      complete: () => setIsLoading(false),
      error: err => {
        setIsLoading(false);
        console.log(err);
      },
    });
  }, []);

  useEffect(() => {
    const WALLET = 1;
    const _account = [...(userData.userAccounts || [])];
    setAccounts(
      _account.filter(acc => acc.type !== TYPE_UNICARD && acc.type !== WALLET),
    );
  }, [userData.userAccounts]);

  const tab = (
    <View style={styles.tabContainer}>
      <Text style={styles.tabTitle}>
        აირჩიეთ Visa ან Mastercard უფასო ბარათი
      </Text>
      <View style={styles.tabContent}>
        {isLoading ? (
          <ActivityIndicator size="small"
          color={colors.primary} style={styles.loadingBox} />
        ) : (
          cardTypes?.map((card, index) => {
            return (
              <CardTab
                key={card.name}
                index={index}
                card={card}
                packageCardTypes={route.params.packageCardTypes}
                setCardsCount={setCardsCount}
                onCardToggle={cardToggle}
              />
            );
          })
        )}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.avoid}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={0}
        style={styles.avoid}>
        <View style={[screenStyles.wraper, styles.container]}>
          <View style={styles.content}>
            <View style={styles.inner}>
              {route?.params?.orderType === StoreActionType.PurchaseCard ? (
                <View style={styles.accountBox}>
                  <Text style={styles.accountBoxTitle}>აირჩიეთ ანგარიში </Text>

                  {selectedFromAccount ? (
                    <AccountItem
                      account={selectedFromAccount}
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
                    accounts={accounts}
                    selectedAccount={selectedFromAccount}
                    accountVisible={fromAccountVisible}
                    onSelect={account => onFromAccountSelect(account)}
                    onToggle={() => setFromAccountVisible(!fromAccountVisible)}
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.tarrifTitle}>არჩეული ანგარიში</Text>
                  <Text style={[styles.tarrifTitle, styles.tarrifValue]}>
                    {route.params.package.paketCode}
                  </Text>

                  <Text style={[styles.tarrifTitle, styles.ccyBox]}>
                    არჩეული სავალუტო პრიორიტეტი
                  </Text>
                  <Text style={[styles.tarrifTitle, styles.tarrifValue]}>
                    {route.params.tarrif.ccy}
                  </Text>
                </>
              )}

              {tab}

              <Text style={styles.checkTitle}>
                მაღალი რისკის მერჩანტების ტრანზაქციების გააქტიურება
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
                  {
                    'დაადასტურეთ სმს კოდით, თუ გსურთ\nგანახორციელოთ ტრანზაქციები: კაზინოს,\nტოტალიზატორის, ლატარიის,საბროკერო და სხვა\nანგარიშებზე'
                  }
                </Text>
              </View>
            </View>

            <View style={styles.bline}>
              <Text style={styles.cardCountInfo}>
                ბარათის რაოდენობა: {cardCount}
              </Text>

              <Text style={styles.info}>
                {route.params.orderType === StoreActionType.TarrifPlan
                  ? `ტარიფის ღირებულება: ${CurrencyConverter(
                      getNumber(
                        route.params.period === Periodes.Year
                          ? route.params.package?.priceAnnual
                          : route.params.package?.priceQuarterly,
                      ),
                    )} ₾`
                  : `ბარათების ღირებულება: ${CurrencyConverter(
                      cardTarrif?.tariffAmount,
                    )} ₾`}
              </Text>
            </View>
          </View>
          <AppButton
            style={styles.button}
            onPress={next}
            isLoading={isLoading}
            title="შემდეგი"
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
    justifyContent: 'space-between',
    paddingBottom: tabHeight,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  avoid: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  inner: {
    marginTop: 40,
  },
  accountBox: {
    marginTop: 0,
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
  bline: {
    marginTop: 18,
    borderTopColor: colors.inputBackGround,
    borderTopWidth: 1,
    paddingTop: 15,
  },
  info: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    textAlign: 'right',
    marginTop: 10,
  },
  cardCountInfo: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    textAlign: 'right',
  },
  cardItem: {
    backgroundColor: colors.inputBackGround,
    borderRadius: 7,
    top: -54,
  },
  tarrifTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
  },
  tarrifValue: {
    marginTop: 5,
  },
  ccyBox: {
    marginTop: 20,
  },
  tabContainer: {
    marginTop: 27,
  },
  tabTitle: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  tabContent: {
    marginTop: 18,
  },
  tabItem: {
    marginTop: 2,
  },
  checkTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    marginTop: 35,
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
  },
  toggleBox: {
    flexShrink: 1,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  loadingBox: {
   position: 'relative',
   top: -5,
   alignSelf: 'flex-start'
   
  },
  button: {
    marginVertical: 40,
  },
});

export default TarriffCalculator;