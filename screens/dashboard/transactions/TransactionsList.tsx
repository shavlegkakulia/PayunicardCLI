import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../../../constants/colors';
import Routes from '../../../navigation/routes';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import {ITransaction} from '../../../services/CardService';
import NetworkService from '../../../services/NetworkService';
import UserService, {
  GetTransactionDetailsRequest,
  IFund,
  IGetTransactionDetailsResponse,
  IStatements,
} from '../../../services/UserService';
import {
  CurrencyConverter,
  CurrencySimbolConverter,
  getNumber,
  getString,
} from '../../../utils/Converter';
import {formatDate} from '../../../utils/utils';
import ActionSheetCustom from './../../../components/actionSheet';
import TransactionDetailView from './TransactionDetailView';

interface IProps {
  statements?: IStatements[];
  unicards?: ITransaction[];
  funds?: IFund[] | undefined;
  isLoading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  hideSeeMoreButton?: boolean;
}

const TransactionsList: React.FC<IProps> = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [transactionDetail, setTransactionDetail] = useState<
    IGetTransactionDetailsResponse | undefined
  >();
  const [fundDetail, setFundDetail] = useState<
  IFund | undefined
>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [asheetHeader, setAsheetHeader] = useState<JSX.Element | null>(null);
  const nav = useNavigation();

  const GetTransactionDetails = (tranId?: number) => {
    if (isLoading || fundDetail) return;

    NetworkService.CheckConnection(() => {
      setIsLoading(true);
      const data: GetTransactionDetailsRequest = {
        tranid: tranId,
      };
      UserService.GetTransactionDetails(data).subscribe({
        next: Response => {
          if (Response.data.ok) {
            setTransactionDetail(Response.data.data);
          }
        },
        complete: () => setIsLoading(false),
        error: () => setIsLoading(false),
      });
    });
  };

  const ViewFundDetails = (fund: IFund) => {
    if (isLoading || transactionDetail) return;
    setFundDetail(fund);
  }

  const containerStyle = [styles.transactionsView, props.containerStyle];

  const TransactionItem: React.FC = () => {
    return (
      <View>
        {!props.unicards ? (
          <View>
            {props.funds?.map((statement, index) => (
              <View
                style={styles.transactionsViewItem}
                key={
                  `blockedFunds-${index}`
                }>
                <View style={styles.transactionsViewItemFund}>
                  <Image
                    source={require('./../../../assets/images/icon-block.png')}
                    resizeMode="contain"
                    style={styles.transactionsViewItemImageFund}
                  />
                </View>
                <TouchableOpacity
                  style={styles.itemPressable}
                  onPress={() => ViewFundDetails(statement)}>
                  <View style={styles.transactionsViewItemRight}>
                    <View style={styles.transactionsViewItemDetail}>
                      <Text style={styles.transactionsViewItemDate}>
                        {formatDate(statement.transactionDate?.toString())}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={styles.transactionsViewItemDescriptionFund}>
                        {statement.merchantDescription}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={styles.transactionsViewItemDescriptionFund}>
                        {statement.terminalNumber?.trimStart()}
                      </Text>
                    </View>
                    <View style={styles.transactionsViewItemInnerRight}>
                      <Text style={styles.transactionViewItemAmountFund}>
                        {CurrencyConverter(statement.amount)}{' '}
                        {CurrencySimbolConverter(statement.currency?.trim())}
                      </Text>
                      <Image
                        source={require('./../../../assets/images/verticall-dots.png')}
                        style={styles.transactionsViewItemMenu}
                      />
                    </View>
                  </View>
                  {props.statements &&
                    index !== props.statements?.length - 1 && (
                      <View style={styles.transactionsViewItemLine}></View>
                    )}
                </TouchableOpacity>
              </View>
            ))}
            <View>
              {props.statements?.map((statement, index) => (
                <View
                  style={styles.transactionsViewItem}
                  key={
                    `statements-${index}`
                  }>
                  <View style={styles.transactionsViewItemFund}>
                    <Image
                      source={
                        statement.imageUrl?.includes('Visa')
                          ? require('./../../../assets/images/visa_35x14.png')
                          : require('./../../../assets/images/mastercard_24x15.png')
                      }
                      style={styles.transactionsViewItemImageFund}
                      resizeMode='contain'
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.itemPressable}
                    onPress={() => GetTransactionDetails(statement.tranID)}>
                    <View style={styles.transactionsViewItemRight}>
                      <View style={styles.transactionsViewItemDetail}>
                        <Text style={styles.transactionsViewItemDate}>
                          {formatDate(statement.tranDate?.toString())}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={styles.transactionsViewItemDescription}>
                          {statement.classCodeDescription}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={styles.transactionsViewItemDescription}>
                          {statement.shortDescription?.trimStart()}
                        </Text>
                      </View>
                      <View style={styles.transactionsViewItemInnerRight}>
                        <Text style={styles.transactionViewItemAmount}>
                          {CurrencyConverter(statement.amount)}{' '}
                          {CurrencySimbolConverter(statement.ccy?.trim())}
                        </Text>
                        <Image
                          source={require('./../../../assets/images/verticall-dots.png')}
                          style={styles.transactionsViewItemMenu}
                        />
                      </View>
                    </View>
                    {props.statements &&
                      index !== props.statements?.length - 1 && (
                        <View style={styles.transactionsViewItemLine}></View>
                      )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ) : (
          props.unicards?.map((statement, index) => (
            <View
              style={styles.transactionsViewItem}
              key={`unicards-${index}`}>
              <Image
                source={require('./../../../assets/images/uniLogo.png')}
                resizeMode="contain"
                style={styles.transactionsViewItemUnicardImage}
              />
              <TouchableOpacity activeOpacity={1} style={styles.itemPressable}>
                <View style={styles.transactionsViewItemRight}>
                  <View style={styles.transactionsViewItemDetail}>
                    <Text style={styles.transactionsViewItemDate}>
                      {formatDate(statement.datetime?.toString())}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={styles.transactionsViewItemDescription}>
                      {statement.tranname}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={styles.transactionsViewItemDescription}>
                      {statement.merchantid?.trimStart()}
                    </Text>
                  </View>
                  <View style={styles.transactionsViewItemInnerRight}>
                    <Text style={styles.transactionViewItemAmount}>
                      {CurrencyConverter(statement.bonusamount)}{' '}
                      <Image
                        source={require('./../../../assets/images/score-star.png')}
                      />
                    </Text>
                    <Image
                      source={require('./../../../assets/images/verticall-dots.png')}
                      style={styles.transactionsViewItemMenu}
                    />
                  </View>
                </View>
                {props.statements && index !== props.statements?.length - 1 && (
                  <View style={styles.transactionsViewItemLine}></View>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    );
  };
  const getHeader = (str: JSX.Element | null) => {
    setAsheetHeader(str);
  };

  const sheetHeight = Dimensions.get('window').height - 120;

  return (
    <View style={containerStyle}>
      <View style={styles.transactionsViewHeader}>
        <Text style={styles.transactionsViewTitle}>{translate.t('transaction.lastTransaction')}</Text>
        {!props.hideSeeMoreButton && (
          <TouchableOpacity onPress={() => nav.navigate(Routes.Transactions)}>
            <Text style={styles.transactionsViewSeeall}>{translate.t('common.all')}</Text>
          </TouchableOpacity>
        )}
      </View>
      {props.isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.loadingBox}
        />
      ) : (
        <TransactionItem />
      )}

      <ActionSheetCustom
        header={asheetHeader}
        scrollable={true}
        hasDraggableIcon={false}
        visible={(transactionDetail != undefined || fundDetail != undefined)}
        hasScroll={true}
        height={sheetHeight}
        onPress={() => { setTransactionDetail(undefined); setFundDetail(undefined); }}>
        <TransactionDetailView
          statement={transactionDetail}
          fundStatement={fundDetail}
          sendHeader={getHeader}
        />
      </ActionSheetCustom>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionsView: {
    flex: 1,
  },
  transactionsViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 17,
    marginBottom: 24,
  },
  transactionsViewTitle: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  transactionsViewSeeall: {
    fontFamily: 'FiraGO-Book',
    fontSize: 12,
    lineHeight: 14,
    color: colors.labelColor,
  },
  transactionsViewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    flex: 1,
  },
  transactionsViewItemImage: {
    marginRight: 13,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  transactionsViewItemFund: {
    marginRight: 13,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#DEE5D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionsViewItemImageFund: {
    width: 20,
    height: 20,
  },
  transactionsViewItemUnicardImage: {
    marginRight: 13,
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  transactionsViewItemRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  transactionsViewItemDetail: {
    flex: 1,
    paddingRight: 8,
  },
  transactionsViewItemDate: {
    fontFamily: 'FiraGO-Book',
    fontSize: 10,
    lineHeight: 12,
    color: colors.labelColor,
  },
  transactionsViewItemDescription: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: colors.black,
    marginTop: 2,
  },
  transactionsViewItemDescriptionFund: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: colors.black,
    marginTop: 2,
    opacity: 0.5,
  },
  transactionsViewItemInnerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionViewItemAmount: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: colors.danger,
  },
  transactionViewItemAmountFund: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: colors.labelColor,
    opacity: 0.5,
  },
  transactionsViewItemMenu: {
    width: 4,
    marginLeft: 9,
  },
  transactionsViewItemLine: {
    borderBottomColor: '#F5F5F5',
    borderBottomWidth: 1,
    flex: 1,
    marginTop: 10,
  },
  loadingBox: {
    flex: 1,
  },
  itemPressable: {
    flex: 1,
  },
});

export default TransactionsList;
