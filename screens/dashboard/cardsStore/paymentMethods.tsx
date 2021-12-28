import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {TYPE_UNICARD} from '../../../constants/accountTypes';
import colors from '../../../constants/colors';
import {CURRENCY_DETAILS} from '../../../constants/currencies';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import {IAccountBallance, ICurrency} from '../../../services/UserService';
import screenStyles from '../../../styles/screens';
import {CurrencySimbolConverter, getString} from '../../../utils/Converter';
import envs from './../../../config/env';

const PaymentMethods: React.FC = () => {
  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const [activeAccounts, setActiveAccounts] = useState<
    IAccountBallance[] | undefined
  >();
  let detailCurrencies: ICurrency[] = [];
  useEffect(() => {
    let userAccounts = [...(userData?.userAccounts || [])];
    let activeCards = userAccounts.filter(account => {
      let Account = {...account};
      let cards = Account.cards?.filter(card => card.status === 1);
      account.cards = cards;
      return account;
    });
    setActiveAccounts(activeCards);

    userAccounts
      .filter(uc => uc.type != TYPE_UNICARD)
      .forEach(account => {
        account.currencies?.forEach(currency => {
          let isContaine =
            detailCurrencies.filter(dc => dc.value === currency.value).length >
            0;
          if (!isContaine) {
            currency.title = getString(
              CURRENCY_DETAILS['ka'].filter(l => l.value == currency.key)[0]
                ?.title,
            );

            detailCurrencies.push(currency);
          }
        });
      });
  }, [userData.userAccounts]);
  return (

      <View style={[screenStyles.wraperWithShadow, styles.bankDetailSection]}>
        <View
          style={[styles.productsViewContainer, screenStyles.shadowedCardbr15]}>
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
      </View>

  );
};

const styles = StyleSheet.create({
  bankDetailSection: {
    marginBottom: 30,
  },
  productsViewContainer: {
    marginTop: 36,
    padding: 17,
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
  sectionTitle: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 18,
    color: colors.black,
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
  terminalLogo: {
    width: 30,
    height: 20,
  },
});

export default PaymentMethods;
