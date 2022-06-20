import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ICategory, IService} from '../../../services/PresentationServive';
import {ICategoryParams} from '../CategoryContainer';

interface IPageProps {
  categories: ICategory[] | IService[] | undefined;
  getCategories: (params: ICategoryParams) => void;
}

const Categories: React.FC<IPageProps> = ({categories, getCategories}) => {
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
  }, [categories]);
  
  if(categories === undefined) {
    return null
  };

  return (
    <View>
      {categories.map(current => (
        <TouchableOpacity
          onPress={() =>
            getCategories({
              parentID: current.categoryID,
              isService: current.isService,
              hasService: current.hasServices,
              hasChildren: current.hasChildren,
              categoryTitle: current.name,
            })
          }>
          <Text key={current.imageUrl}>{current.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({});
