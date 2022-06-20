import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IMerchant} from '../../../services/PresentationServive';

interface IPageProps {
  merchants: IMerchant[] | undefined;
}

const Merchants: React.FC<IPageProps> = ({merchants}) => {
  const navigation = useNavigation();
  const unsubscribe = useRef<() => void>();
  useEffect(() => {
    unsubscribe.current = navigation.addListener('beforeRemove', e => {
        Alert.alert('!');
        e.preventDefault();
    });

    return () => {
      unsubscribe.current?.();
    };
  }, [merchants]);
  
  if(merchants === undefined) {
    return null;
  };

  return (
    <View>
      {merchants.map(current => (
        <TouchableOpacity>
          <Text key={current.imageUrl}>{current.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Merchants;

const styles = StyleSheet.create({});
