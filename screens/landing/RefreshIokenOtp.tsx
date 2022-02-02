import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../redux/action_types/translate_action_types';
import colors from '../../constants/colors';
import {email as _email} from '../../components/UI/Validation';
import {useSelector} from 'react-redux';
import {tabHeight} from '../../navigation/TabNav';
import FloatingLabelInput from '../../containers/otp/Otp';
import AppButton from '../../components/UI/AppButton';
import AuthService, {IAuthorizationResponse} from '../../services/AuthService';
import axios from 'axios';
import envs from './../../config/env';
import Store from './../../redux/store';
import {
  IAuthAction,
  LOGIN,
  REFRESH,
} from '../../redux/action_types/auth_action_types';
import {useNavigation} from '@react-navigation/native';
import { getString } from '../../utils/Converter';
import SmsRetriever from 'react-native-sms-retriever';
import AsyncStorage from '../../services/StorageService';
import { TOKEN_EXPIRE } from '../../constants/defaults';

const RefreshTokenOtp: React.FC = () => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [otpGuid, setOtpGuid] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const nav = useNavigation();

  const goRefreshToken = async () => {
    setIsLoading(true);
    const refreshToken = await AuthService.getRefreshToken();
    const refreshObj = new FormData();
    refreshObj.append('scope', 'Wallet_Api.Full offline_access');
    refreshObj.append('client_id', envs.client_id);
    refreshObj.append('client_secret', envs.client_secret);
    refreshObj.append('grant_type', 'refresh_token');
    refreshObj.append('refresh_token', refreshToken);
    refreshObj.append('Otp', otpGuid);
    return axios
      .post<IAuthorizationResponse>(
        `${envs.CONNECT_URL}connect/token`,
        refreshObj,
        {anonymous: true},
      )
      .then(async response => {
        if (!response.data.access_token) {
          nav.goBack();
        }

        const date = new Date();
        date.setSeconds(date.getSeconds() + response.data.expires_in);
        const expObject = {
          expDate: date,
        };
        await AsyncStorage.removeItem(TOKEN_EXPIRE);
        await AsyncStorage.setItem(TOKEN_EXPIRE, JSON.stringify(expObject));

        await AuthService.removeToken();
        await AuthService.setToken(
          response.data.access_token,
          response.data.refresh_token,
        );

        Store.dispatch<IAuthAction>({
          type: REFRESH,
          accesToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        });

        Store.dispatch({
          type: LOGIN,
          accesToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          isAuthenticated: true,
        });
      })
      .catch(() => {
        nav.goBack();
      })
      .finally(() => setIsLoading(false));
  };

  const onSmsListener = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        SmsRetriever.addSmsListener(event => {
          const otp = /(\d{4})/g.exec(getString(event.message))![1];
          setOtpGuid(otp);
        }); 
      }
    } catch (error) {
   
    }
  };

  useEffect(() => {
    onSmsListener();

    return () => SmsRetriever.removeSmsListener();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.avoid}>
      <View style={styles.content}>
        <View>
          <View style={styles.insertOtpSTep}>
            <Text style={styles.insertOtpCode}>
              {translate.t('otp.enterOtp')}
            </Text>
            <FloatingLabelInput
              Style={styles.otpBox}
              label={translate.t('otp.smsCode')}
              title={translate.t('otp.otpSentBlank')}
              resendTitle={translate.t('otp.resend')}
              value={otpGuid}
              onChangeText={setOtpGuid}
              onRetry={goRefreshToken}
            />
          </View>
        </View>
        <AppButton
          title={translate.t('common.next')}
          onPress={goRefreshToken}
          isLoading={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  avoid: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.white,
  },
  content: {
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: tabHeight + 40,
  },
  insertOtpSTep: {
    marginTop: 25,
  },
  insertOtpCode: {
    fontFamily: 'FiraGO-Bold',
    fontWeight: '500',
    color: colors.black,
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'left',
  },
  otpBox: {
    marginTop: 40,
  },
});

export default RefreshTokenOtp;
