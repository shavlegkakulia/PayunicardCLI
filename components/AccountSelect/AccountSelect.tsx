import React, {useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../../constants/colors';
import {GEL} from '../../constants/currencies';
import {useDimension} from '../../hooks/useDimension';
import {IAccountBallance} from '../../services/UserService';
import {
  CurrencyConverter,
  CurrencySimbolConverter,
} from '../../utils/Converter';

interface IProps {
  accounts: IAccountBallance[] | undefined;
  selectedAccount: IAccountBallance | undefined;
  accountVisible: boolean;
  onSelect: (account: IAccountBallance) => void;
  onToggle: (visible?: boolean) => void;
  style?: StyleProp<ViewStyle>;
  notSelectable?: IAccountBallance | undefined;
}

interface IItemProps {
  account: IAccountBallance;
  onAccountSelect: (account: IAccountBallance) => void;
  isSelected?: boolean;
  style?: StyleProp<ViewStyle>;
  disable?: boolean;
}

export const AccountItem: React.FC<IItemProps> = props => {
  const accountSelect = () => {
    if (props.disable) return;
    props.onAccountSelect(props.account);
  };

  return (
    <TouchableOpacity
      style={[
        styles.item,
        props.isSelected ? styles.activeIitem : {},
        props.style,
        props.disable && styles.disabledAccount,
      ]}
      onPress={accountSelect}>
      <View style={styles.itemLeft}>
        <View style={styles.imageContainer}>
          {props.account.type === 7 ? (
            <Image
              source={require('./../../assets/images/uniLogo.png')}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={{uri: props.account.imageUrl}}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.accountDetail}>
          <Text style={styles.accountNumber}>
            {props.account.accountNumber}
          </Text>
          <View style={styles.ccyContainer}>
            {props.account.currencies?.map(currency => (
              <Text key={currency.key} style={styles.ccy}>
                {currency.value}
                {CurrencyConverter(currency.balance)}
              </Text>
            ))}
          </View>
        </View>
      </View>
      {props.account.type !== 7 ? (
        <Text style={styles.amount}>
          {CurrencyConverter(props.account.availableInGEL)}
          {CurrencySimbolConverter(GEL)}
        </Text>
      ) : (
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.amount}>
            {CurrencyConverter(props.account.availableInGEL)}{' '}
          </Text>
          <Image source={require('./../../assets/images/score-star.png')} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const AccountSelect: React.FC<IProps> = props => {
  const dimension = useDimension();

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.accountVisible}
        onRequestClose={() => {
          props.onToggle();
        }}>
        <TouchableOpacity
          style={styles.background}
          activeOpacity={1}
          onPress={() => props.onToggle()}
        />
        <View style={styles.centeredView}>
          <View style={[styles.modalView]}>
            <ScrollView style={{maxHeight: dimension.height - 200}}>
              {props.accounts?.map(account => (
                <AccountItem
                  key={account.accountId}
                  disable={
                    (account.accountNumber !== undefined &&
                      account?.accountNumber ===
                        props.notSelectable?.accountNumber) ||
                    (account.accountId !== undefined &&
                      account?.accountId === props.notSelectable?.accountId)
                  }
                  account={account}
                  onAccountSelect={props.onSelect}
                  isSelected={
                    props.selectedAccount?.accountId === account.accountId
                  }
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 30,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 380,
  },
  background: {
    flex: 1,
    backgroundColor: '#00000098',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: colors.baseBackgroundColor,
    borderBottomColor: colors.baseBackgroundColor,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 30,
    height: 54,
    //paddingVertical: 20
  },
  activeIitem: {
    borderTopColor: colors.primary,
    borderBottomColor: colors.primary,
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
  disabledAccount: {
    opacity: 0.5,
  },
});

export default AccountSelect;
