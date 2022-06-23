import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import colors from '../../../constants/colors';
import {ICategory, IService} from '../../../services/PresentationServive';

interface IPageProps extends ICategory, IService {
  onPress: (item: ICategory | IService) => void;
  itemStyle?: StyleProp<ViewStyle>;
  imageBoxStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

const Item: React.FC<IPageProps> = props => {
  const {
    imageUrl,
    merchantServiceURL,
    name,
    cannotPay,
    numberOfLines,
    onPress,
    isLoading,
    itemStyle,
    imageStyle,
    textStyle,
    imageBoxStyle,
  } = props;

  let imageUri: string = '';
  if (imageUrl !== undefined) {
    imageUri = imageUrl;
  } else if (merchantServiceURL !== undefined) {
    imageUri = merchantServiceURL;
  }

  return (
    <TouchableOpacity
      style={[styles.item, itemStyle, cannotPay && {opacity: 0.5}]}
      onPress={() => !cannotPay && onPress(props)}>
      {imageUri && (
        <View style={[styles.LogoBox, imageBoxStyle]}>
          {isLoading ? (
            <ActivityIndicator
              style={[styles.img, imageStyle]}
              size={'small'}
              color={colors.primary}
            />
          ) : (
            <Image
              source={{uri: imageUri.replace('svg', 'png')}}
              resizeMode={'contain'}
              style={[styles.img, imageStyle]}
            />
          )}
        </View>
      )}
      <Text numberOfLines={numberOfLines || 1} style={[styles.text, textStyle]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  LogoBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBackGround,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 25,
  },
});
