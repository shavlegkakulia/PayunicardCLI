import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../../../constants/colors';
import {GEL} from '../../../constants/currencies';
import {IAccountBallance} from '../../../services/UserService';
import {
  CurrencyConverter,
  CurrencySimbolConverter,
} from '../../../utils/Converter';

interface IItemProps extends IAccountBallance {
  isSelected?: boolean;
  style?: StyleProp<ViewStyle>;
  activeItemStyle?: StyleProp<ViewStyle>;
  disable?: boolean;
  placeholder?: string;
}

export const AccountPlaceholder: React.FC<IItemProps> = ({
  placeholder,
  activeItemStyle
}) => { console.log(activeItemStyle)
  return (
    <View style={[styles.item, styles.placeholderItem, activeItemStyle]}>
      {placeholder !== undefined ? <Text style={styles.placeholderItem}>{placeholder}</Text> : null}
      <Image source={require('./../../../assets/images/down-arrow.png')} />
    </View>
  );
};

export const AccountItem: React.FC<IItemProps> = props => {
  if (!props.accountId) {
    return <AccountPlaceholder {...props} placeholder={props.placeholder} />;
  }
  return (
    <View
      style={[
        props.activeItemStyle,
        styles.item,
        props.isSelected ? styles.activeIitem : {},
        props.style,
        props.disable && styles.disabledAccount,
      ]}>
      <View style={styles.itemLeft}>
        <View style={styles.imageContainer}>
          {props.type === 7 ? (
            <Image
              source={require('./../../../assets/images/uniLogo.png')}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={{uri: props.imageUrl}}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.accountDetail}>
          <Text style={styles.accountNumber}>{props.accountNumber}</Text>
          <View style={styles.ccyContainer}>
            {props.currencies?.map(currency => (
              <Text key={currency.key} style={styles.ccy}>
                {currency.value}
                {CurrencyConverter(currency.balance)}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <View>
        {props.type !== 7 ? (
          <Text style={styles.amount}>
            {CurrencyConverter(props.availableInGEL)}
            {CurrencySimbolConverter(GEL)}
          </Text>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.amount}>
              {CurrencyConverter(props.availableInGEL)}{' '}
            </Text>
            <Image
              source={require('./../../../assets/images/score-star.png')}
              style={styles.coin}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeIitem: {
    borderTopColor: colors.primary,
    borderBottomColor: colors.primary,
  },
  disabledAccount: {
    opacity: 0.5,
  },
  amount: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    marginLeft: 15,
  },
  itemLeft: {
    flexDirection: 'row',
  },
  accountDetail: {
    justifyContent: 'center',
  },
  imageContainer: {
    marginRight: 15,
    justifyContent: 'center',
  },
  image: {
    width: 20,
    height: 20,
  },
  accountNumber: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
  },
  ccyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ccy: {
    fontFamily: 'FiraGO-Book',
    fontSize: 10,
    lineHeight: 12,
    color: colors.labelColor,
  },
  coin: {
    width: 18,
    height: 18,
  },
  placeholderItem: {
    paddingVertical: 9,
  },
  placeholderText: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
  }
});
