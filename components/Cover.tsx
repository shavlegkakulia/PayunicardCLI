import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageProps,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../constants/colors';

interface IProps {
  imageUrl?: string;
  isLoading?: boolean;
  localImage?: ImageProps;
  style?: StyleProp<ViewStyle>;
  imgStyle?:  StyleProp<ImageStyle>;
}

const Cover: React.FC<IProps> = props => {
  return (
    <View style={[styles.item, props.style]}>
      {props.isLoading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : props.localImage ? (
        <Image source={props.localImage} style={[styles.logo, props.imgStyle]} />
      ) : (
        <Image source={{uri: props.imageUrl}} style={[styles.logo, props.imgStyle]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
  },
  logo: {
    width: 40,
    height: 40,
  },
  loaderBox: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Cover;
