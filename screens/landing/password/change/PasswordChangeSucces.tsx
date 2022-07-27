import {useNavigation} from '@react-navigation/core';
import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import { useSelector } from 'react-redux';
import AppButton from '../../../../components/UI/AppButton';
import colors from '../../../../constants/colors';
import Routes from '../../../../navigation/routes';
import {tabHeight} from '../../../../navigation/TabNav';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../../redux/action_types/translate_action_types';

type RouteParamList = {
  params: {
    backRoute: string | undefined;
  };
};

const PasswordChangeSucces: React.FC = () => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const navigation = useNavigation();
  const complate = () => {
    navigation.navigate(route.params.backRoute || Routes.Landing);
  };

  return (
    <View style={styles.succesContainer}>
      <View style={styles.succesInner}>
        <View style={styles.succesView}>
          <Image source={require('./../../../../assets/images/succes_icon.png')} />
          <Text style={styles.succesText}>{translate.t('password.pasChanged')}</Text>
        </View>
        <AppButton title={translate.t('common.close')} onPress={complate} style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  succesContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: tabHeight + 20,
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
  succesView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    maxWidth: '90%',
    width: 300
  },
});

export default PasswordChangeSucces;
