import axios from 'axios';
import React, {useEffect, useRef} from 'react';
import {
  PanResponder,
  PanResponderInstance,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {TOKEN_EXPIRE} from '../constants/defaults';
import {Logout} from '../redux/actions/auth_actions';
import {IAuthAction, REFRESH} from '../redux/action_types/auth_action_types';
import AuthService, {IAuthorizationResponse} from '../services/AuthService';
import CommonService from '../services/CommonService';
import AsyncStorage from '../services/StorageService';
import {getString} from '../utils/Converter';
import envs from './../config/env';
import Store from './../redux/store';
import BackgroundTimer from 'react-native-background-timer';

const IdleHook: React.FC = props => {
  const panResponder = useRef<PanResponderInstance>();
  const timer = useRef<number>();
  const tokenTTLTime = useRef<NodeJS.Timeout>();
  const accesRefresh = useRef<NodeJS.Timeout>();
  let activeTTL = 80;
  let currentTime = 0;
  const ttlWarningValue = 5 * 60; //5 minutes
  const expireDate = useRef<string | null>();
  const isrefresfing = useRef<boolean>(false);
  const dispatch = useDispatch();

  const goRefreshToken = async () => {
    let {refreshToken, accesToken} = Store.getState().AuthReducer;
    const refreshObj = new FormData();
    refreshObj.append('scope', 'Wallet_Api.Full offline_access');
    refreshObj.append('client_id', envs.client_id);
    refreshObj.append('client_secret', envs.client_secret);
    refreshObj.append('grant_type', 'refresh_token');
    refreshObj.append('refresh_token', refreshToken);

    if (isrefresfing.current) return;
    isrefresfing.current = true;

    if (accesRefresh.current) clearTimeout(accesRefresh.current);
    console.log(refreshToken, accesToken);

    return axios
      .post<IAuthorizationResponse>(
        `${envs.CONNECT_URL}connect/token`,
        refreshObj,
        {
          skipRefresh: true,
          headers: {
            Authorization: `Bearer ${accesToken}`,
          },
        },
      )
      .then(async response => {
        if (!response.data.access_token) throw response;

        const date = new Date();
        date.setSeconds(date.getSeconds() + response.data.expires_in);
        const expObject = {
          expDate: date,
        };
        await AsyncStorage.removeItem(TOKEN_EXPIRE);
        await AsyncStorage.setItem(TOKEN_EXPIRE, JSON.stringify(expObject));
        expireDate.current = JSON.stringify(expObject);

        const isPassCodeEnabled = await AsyncStorage.getItem('PassCodeEnbled');
        if (isPassCodeEnabled !== null) {
          await AuthService.removeToken();

          await AuthService.setToken(
            response.data.access_token,
            response.data.refresh_token,
          );
        }

        Store.dispatch<IAuthAction>({
          type: REFRESH,
          accesToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        });

        accesRefresh.current = setTimeout(() => {
          isrefresfing.current = false;
        }, 1000);
      })
      .catch(_ => {
        isrefresfing.current = false;
        dispatch(Logout());
      });
  };

  const resetInactivityTimeout = () => {
    if (timer.current) BackgroundTimer.clearInterval(timer.current);
    currentTime = 0;
    CommonService.uactionIntervals?.forEach(() => {
      const id = CommonService.uactionIntervals?.shift();
      if (id) BackgroundTimer.clearInterval(id);
    });

    CommonService.uactionIntervals.push(
      ...(CommonService.uactionIntervals || []),
      (timer.current = BackgroundTimer.setInterval(() => {
        if (currentTime >= activeTTL) {
          CommonService.uactionIntervals = [];
          if (timer.current) BackgroundTimer.clearInterval(timer.current);
          dispatch(Logout());
        }
        console.log(currentTime);
        currentTime = currentTime + 1;
      }, 1000)),
    );
  };

  useEffect(() => {
    if (Platform.OS == 'ios') {
      BackgroundTimer.start();
    }

    return () => {
      if (Platform.OS == 'ios') {
        BackgroundTimer.stop();
      }
    }
  }, []);

  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimeout();
        return false;
      },
    });
    resetInactivityTimeout();

    return () => {
      currentTime = 0;
      CommonService.uactionIntervals?.forEach(() => {
        const id = CommonService.uactionIntervals?.shift();
        if (id) BackgroundTimer.clearInterval(id);
      });
      if (timer.current) BackgroundTimer.clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    CommonService.ttlIntervals?.forEach(() => {
      const id = CommonService.ttlIntervals?.shift();
      if (id) clearInterval(id);
    });

    (async () => {
      expireDate.current = await AsyncStorage.getItem(TOKEN_EXPIRE);

      if (tokenTTLTime.current) clearTimeout(tokenTTLTime.current);
      CommonService.ttlIntervals.push(
        ...(CommonService.ttlIntervals || []),
        (tokenTTLTime.current = setInterval(async () => {
          const formatedDate = JSON.parse(getString(expireDate.current));
          const ttl =
            (new Date(formatedDate.expDate).getTime() - new Date().getTime()) /
            100 /
            10;
          let {refreshToken} = Store.getState().AuthReducer;
          //console.log(Math.round(ttl), refreshToken);
          if (Math.round(ttl) <= ttlWarningValue) {
            await goRefreshToken();
          }
        }, 1000)),
      );
    })();

    return () => {
      CommonService.ttlIntervals?.forEach(() => {
        const id = CommonService.ttlIntervals?.shift();
        if (id) clearInterval(id);
      });
      if (tokenTTLTime.current) clearTimeout(tokenTTLTime.current);
    };
  }, []);

  return (
    <View
      style={styles.content}
      {...(panResponder.current?.panHandlers &&
        panResponder.current.panHandlers)}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default IdleHook;
