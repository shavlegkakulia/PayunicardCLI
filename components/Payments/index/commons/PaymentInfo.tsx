import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import { isUndefined } from '../../../../utils/Converter';

export interface IPaymentInfoDetails {
  serviceName?: string;
  serviceLogoUrl?: string;
  abonentCode?: string;
  debt?: string;
  abonentName?: string;
  address?: string;
}

interface IPageProps extends IPaymentInfoDetails {}

const PaymentInfo: React.FC<IPageProps> = props => {
  const {serviceName, serviceLogoUrl, debt, abonentCode, abonentName, address} =
    props || {};

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Image source={{uri: serviceLogoUrl}} style={styles.serviceLogo} resizeMode={'contain'} />
      </View>
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.serviveName}>
          {serviceName}
        </Text>
        {(!isUndefined(abonentName) || !isUndefined(address)) && (
          <Text numberOfLines={2} style={styles.serviveLabels}>
            {!isUndefined(abonentName) &&
              `${abonentName} ${!isUndefined(address) ? ',' : ''}`}{' '}
            {!isUndefined(address) ? address : ''}
          </Text>
        )}
        {(!isUndefined(abonentCode) || !isUndefined(debt)) && (
          <Text numberOfLines={2} style={styles.serviveLabels}>
            {!isUndefined(abonentCode) &&
              `${abonentCode} ${!isUndefined(debt) ? ',' : ''}`}{' '}
            {!isUndefined(debt) ? debt : ''}
          </Text>
        )}
      </View>
    </View>
  );
};

export default PaymentInfo;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#94DD3420'
  },
  serviceLogo: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  serviveName: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 18,
  },
  serviveLabels: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 18,
  },
});
