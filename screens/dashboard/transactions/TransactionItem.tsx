import React from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import colors from "../../../constants/colors";
import { ITransaction } from "../../../services/CardService";
import { IFund, IStatements } from "../../../services/UserService";
import { CurrencyConverter, CurrencySimbolConverter } from "../../../utils/Converter";
import { formatDate } from "../../../utils/utils";

interface IProps {
    unicards?: ITransaction[];
    funds?: IFund[] | undefined;
    onViewFundDetails: (fund: IFund) => void;
    onGetTransactionDetails: (tranId?: number) => void;
    statements?: IStatements[];
}

const TransactionItem: React.FC<IProps> = (props) => {
    return (
      <View>
        {!props.unicards ? (
          <View>
            {props.funds?.map((statement, index) => (
              <View
                style={styles.transactionsViewItem}
                key={`blockedFunds-${index}`}>
                <View style={styles.transactionsViewItemFund}>
                  <Image
                    source={require('./../../../assets/images/icon-block.png')}
                    resizeMode="contain"
                    style={styles.transactionsViewItemImageFund}
                  />
                </View>
                <TouchableOpacity
                  style={styles.itemPressable}
                  onPress={() => props.onViewFundDetails(statement)}>
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
                  {props.statements && index !== props.statements?.length - 1 && (
                    <View style={styles.transactionsViewItemLine}></View>
                  )}
                </TouchableOpacity>
              </View>
            ))}
            <View>
              {props.statements?.map((st, index) => (
                <View
                  style={styles.transactionsViewItem}
                  key={`statements-${index}`}>
                  <View style={styles.transactionsViewItemFund}>
                    <Image
                      source={
                        st.imageUrl?.includes('Visa')
                          ? require('./../../../assets/images/visa_35x14.png')
                          : require('./../../../assets/images/mastercard_24x15.png')
                      }
                      style={styles.transactionsViewItemImageFund}
                      resizeMode="contain"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.itemPressable}
                    onPress={() => props.onGetTransactionDetails(st.tranID)}>
                    <View style={styles.transactionsViewItemRight}>
                      <View style={styles.transactionsViewItemDetail}>
                        <Text style={styles.transactionsViewItemDate}>
                          {formatDate(st.tranDate?.toString())}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={styles.transactionsViewItemDescription}>
                          {st.classCodeDescription}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={styles.transactionsViewItemDescription}>
                          {st.shortDescription?.trimStart()}
                        </Text>
                      </View>
                      <View style={styles.transactionsViewItemInnerRight}>
                        <Text style={styles.transactionViewItemAmount}>
                          {CurrencyConverter(st.amount)}{' '}
                          {CurrencySimbolConverter(st.ccy?.trim())}
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
              ))}
            </View>
          </View>
        ) : (
          props.unicards?.map((statement, index) => (
            <View style={styles.transactionsViewItem} key={`unicards-${index}`}>
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

  const styles = StyleSheet.create({
    transactionsViewItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        flex: 1,
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
      itemPressable: {
        flex: 1,
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
      transactionsViewItemDescription: {
        fontFamily: 'FiraGO-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: colors.black,
        marginTop: 2,
      },
      transactionViewItemAmount: {
        fontFamily: 'FiraGO-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: colors.danger,
      },
      transactionsViewItemUnicardImage: {
        marginRight: 13,
        width: 20,
        height: 20,
        borderRadius: 20,
      },
  })

  export default TransactionItem;