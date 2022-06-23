import React from 'react';
import {StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {ICategory, IService} from '../../../services/PresentationServive';
import Item from './Item';

interface IPageProps {
  categories: ICategory[] | IService[] | undefined;
  getCategories: (item: ICategory | IService) => void;
}

const Categories: React.FC<IPageProps> = ({categories, getCategories}) => {
  if (categories === undefined) {
    return null;
  }

  return (
    <FlatList
      keyExtractor={item => item.name}
      data={categories}
      renderItem={item => (
        <Item {...item.item} onPress={getCategories} />
      )}
      style={styles.content}
    />
  );
};

export default Categories;

const styles = StyleSheet.create({content: {flex: 1, paddingHorizontal: 17}});
