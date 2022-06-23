import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ICategory, IMerchant, IService} from '../../../services/PresentationServive';
import Item from '../categories/Item';

interface IPageProps {
  merchants: IMerchant[] | undefined;
  getCategories: (item: ICategory | IService) => void;
}

const Merchants: React.FC<IPageProps> = ({merchants, getCategories}) => {
  if (merchants === undefined) {
    return null;
  }

  return (
    <View style={styles.content}>
      {merchants.map(current => (
        <Item key={current.name} {...current} onPress={getCategories} />
      ))}
    </View>
  );
};

export default Merchants;

const styles = StyleSheet.create({content: {flex: 1, paddingHorizontal: 17}});
