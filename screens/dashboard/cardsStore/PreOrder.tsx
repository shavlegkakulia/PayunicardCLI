import {RouteProp, useRoute} from '@react-navigation/core';
import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {StoreActionType} from '.';
import AppButton from '../../../components/UI/AppButton';
import colors from '../../../constants/colors';
import Routes from '../../../navigation/routes';
import {tabHeight} from '../../../navigation/TabNav';
import {
  IUserState,
  IGloablState,
} from '../../../redux/action_types/user_action_types';
import {IGetCardOrderingTariffAmountResponse} from '../../../services/CardService';
import NavigationService from '../../../services/NavigationService';
import {
  ICardType,
  ICity,
  IPackage,
  IPackageCard,
} from '../../../services/PresentationServive';
import UserService, {
  ICustomerBatchPackageRegistrationRequest,
  ICustomerPackageRegistrationRequest,
} from '../../../services/UserService';
import screenStyles from '../../../styles/screens';
import {
  CurrencyConverter,
  getNumber,
  getString,
} from '../../../utils/Converter';
import { delyveryMethods } from './DelyveryMethods';

type RouteParamList = {
  params: {
    package: IPackage;
    tarrif: IPackageCard;
    packageCardTypes: IPackageCard[] | undefined;
    orderType: string;
    totalFee: number | undefined;
    deliveryAmount: number | undefined;
    cardAmount: number | undefined;
    tarrifAmount: number | undefined;
    hrm: boolean;
    address: string;
    city?: ICity;
    village: string;
    selectedFromAccount: string | undefined;
    cardTypes: ICardType[] | undefined;
    delyveryMethod: string;
    period: string;
  };
};

const PreOrder: React.FC = props => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userData = useSelector<IGloablState>(
    state => state.UserReducer,
  ) as IUserState;

  const balanceSum = userData.userProducts?.reduce(function (state, current) {
    return state + getNumber(current.balance);
  }, 0);

  const hasTotalFee = getNumber(route.params.totalFee) <= getNumber(balanceSum);

  const next = () => {
    const parameters = {
      orderType: route.params.orderType,
      totalFee: route.params.totalFee,
      deliveryAmount: route.params.deliveryAmount,
      cardAmount:
        route.params.orderType === StoreActionType.TarrifPlan
          ? 0
          : route.params.cardAmount,
      tarrifAmount: route.params.tarrifAmount,
      hrm: route.params.hrm,
      address: route.params.address,
      city: route.params.city,
      village: route.params.village,
      selectedFromAccount: route.params.selectedFromAccount,
      cardTypes: route.params.cardTypes,
      delyveryMethod: delyveryMethods,
      hasTotalFee: hasTotalFee,
      tarrif: route.params.tarrif,
      packageCardTypes: route.params.packageCardTypes,
      period: route.params.period,
      package: route.params.package,
    };
    if (route.params.orderType === StoreActionType.PurchaseCard) {
      CustomerBatchPackageRegistration(parameters);
      return;
    }
    NavigationService.navigate(Routes.TarrifSetOtp, parameters);
  };

  const CustomerBatchPackageRegistration = (p: any) => {
    setIsLoading(true);
    const packages: ICustomerPackageRegistrationRequest[] = [];
    const choosenCardTypes = route.params.cardTypes?.filter(ct => ct.willCount && ct.willCount > 0);
    let cardData: ICustomerPackageRegistrationRequest = {
      paketTypeid: null,
      accountNumberCh: route.params.selectedFromAccount,
      cardDeliveryCountryID: 79,
      customerId: userData.userDetails?.customerID,
      termID: 1,
    };

    if (route.params.delyveryMethod === delyveryMethods.inServiceCenter) {
      cardData = {...cardData, serviseCenter: 1};
    } else {
      cardData = {
        ...cardData,
        cardDeliveryCityID: route.params?.city?.cityId,
        cardDeliveryCity: route.params?.city?.name,
        cardDeliveryAddress: route.params.address + route.params.village,
      };
    }
    choosenCardTypes?.map(ct => {
      for(let i = 0; i < getNumber( ct.willCount); i++) {
        cardData = {...cardData, cardTypeID: ct.typeId};
        packages.push(cardData);
      }
    })

    console.log('//////////////////', packages)

    const data: ICustomerBatchPackageRegistrationRequest = {
      packages: [...packages],
    };

    UserService.CustomerBatchPackageRegistration(data).subscribe({
      next: Response => {
        console.log('Response', Response)
        if(Response.data.ok) {
          NavigationService.navigate(Routes.PrintInfo, p);
        }
      },
      complete: () => {
        setIsLoading(false);
      },
      error: err => {
        setIsLoading(false);
        console.log('**********', err);
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.avoid}>
      <View style={[screenStyles.wraper, styles.container]}>
        <View style={styles.content}>
          <Image
            source={
              hasTotalFee
                ? require('./../../../assets/images/succes_icon.png')
                : require('./../../../assets/images/info_orange_fill.png')
            }
            style={styles.icon}
          />
          <Text style={styles.infoHeader}>
            {hasTotalFee
              ? 'შეკვეთის დადასტურება'
              : 'ანგარიშზე არ არის\nსაკმარისი თანხა'}
          </Text>
          {!hasTotalFee && (
            <Text style={styles.info}>
              გთხოვთ ანგარიში შეავსოთ <Text style={styles.bold}>90 ლარით</Text>{' '}
              არაუგვიანეს{'\n'}
              <Text style={styles.bold}>
                2021 წლის 24 თებერვლის 00:00 საათისა,
              </Text>
              {'\n'}
              წინააღმდეგ შემთხვევაში თქვენი შეკვეთა გაუქმდება
            </Text>
          )}
          <View style={styles.bottomInfo}>
            <View style={styles.ul}>
              <Text style={styles.li}>ადგილზე მიტანის საკომისიო:</Text>
              <Text style={styles.li}>
                {CurrencyConverter(route.params.deliveryAmount)}₾
              </Text>
            </View>
            <View style={styles.ul}>
              <Text style={styles.li}>ბარათების ღირებულება:</Text>
              <Text style={styles.li}>
                {CurrencyConverter(getNumber(route.params.cardAmount))}₾
              </Text>
            </View>
            {route.params.orderType === StoreActionType.TarrifPlan && (
              <View style={styles.ul}>
                <Text style={styles.li}>ტარიფის ღირებულება:</Text>
                <Text style={styles.li}>
                  {CurrencyConverter(getNumber(route.params.tarrifAmount))}₾
                </Text>
              </View>
            )}
            <View style={styles.ul}>
              <Text style={[styles.li, styles.lastLi]}>სულ გადასახდელი:</Text>
              <Text style={[styles.li, styles.lastLi]}>
                {CurrencyConverter(route.params.totalFee)} ₾
              </Text>
            </View>
          </View>

          <View style={styles.delyveryInfo}>
            <Text style={styles.addrTitle}>მიწოდების მისამართი</Text>
            <Text style={styles.addrValue}>
              {route.params.delyveryMethod === delyveryMethods.inAddress
                ? `${getString(route.params?.city?.name)}, ${getString(
                    route.params.address,
                  )}, ${getString(route.params.village)}`
                : 'სერვის ცენტრი'}
            </Text>
          </View>

          {!hasTotalFee && (
            <Text style={styles.description}>
              {
                '*თანხის ანგარიშზე შემოტანის შემდეგ მოხდება\nმიწოდების სერვისისთვის დროის ათვლა '
              }
            </Text>
          )}
        </View>
        <AppButton
          style={styles.button}
          onPress={next}
          isLoading={isLoading}
          title={`${
            hasTotalFee
              ? 'შეკვეთის დადასტურება'
              : 'წინასწარი შეკვეთის დადასტურება'
          }`}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingBottom: tabHeight,
  },
  content: {
    flex: 1,
    flexShrink: 1,
  },
  avoid: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  icon: {
    alignSelf: 'center',
    marginTop: 40,
  },
  infoHeader: {
    marginTop: 12,
    fontFamily: 'FiraGO-Bold',
    fontSize: 16,
    lineHeight: 19,
    color: colors.black,
    textAlign: 'center',
  },
  info: {
    marginTop: 13,
    fontFamily: 'FiraGO-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: colors.labelColor,
    textAlign: 'center',
  },
  bold: {
    color: colors.black,
    fontWeight: '700',
  },
  description: {
    marginTop: 20,
    fontFamily: 'FiraGO-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: colors.black,
  },
  bottomInfo: {
    marginTop: 53,
  },
  ul: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  li: {
    marginBottom: 20,
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    textAlign: 'right',
  },
  lastLi: {
    color: colors.black,
    marginBottom: 0,
  },
  delyveryInfo: {
    marginTop: 40,
  },
  addrTitle: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  addrValue: {
    marginTop: 7,
    fontFamily: 'FiraGO-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: colors.labelColor,
  },
  button: {
    marginVertical: 40,
  },
});

export default PreOrder;
