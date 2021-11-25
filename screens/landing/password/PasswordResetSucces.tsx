import { useNavigation } from '@react-navigation/core';
import React from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import AppButton from '../../../components/UI/AppButton';
import colors from '../../../constants/colors';
import Routes from '../../../navigation/routes';
import { tabHeight } from '../../../navigation/TabNav';

const PasswordResetSucces: React.FC = () => {
  const navigation = useNavigation();
  const complate = () => {
    navigation.navigate(Routes.Landing);
  }

  return (
    <View style={styles.succesContainer}>
      <View style={styles.succesInner}>
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Image source={require('./../../../assets/images/succes_icon.png')} />
          <Text style={styles.succesText}>პაროლი წარმატებით შეიცვალა</Text>
        </View>
        <AppButton
            title='დახურვა'
            onPress={complate}
            style={styles.button}
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  succesContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: tabHeight
  },
  succesText: {
    textAlign: 'center',
    justifyContent: 'space-between',
    fontFamily: 'FiraGO-Medium',
    fontSize: 16,
    lineHeight: 19,
    color: colors.black,
    marginTop: 28,
  },
  succesInner: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  button: {
    maxWidth: '90%',
    width: 300
  }
});

export default PasswordResetSucces;
