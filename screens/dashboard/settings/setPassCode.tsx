import React, {useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import SUBSCRIBTION_KEYS from '../../../constants/subscribtionKeys';
import {tabHeight} from '../../../navigation/TabNav';
import {PUSH} from '../../../redux/actions/error_action';
import {
  IAuthState,
  IGlobalState as AuthState,
} from '../../../redux/action_types/auth_action_types';
import {
  IGloablState,
  IUserState,
} from '../../../redux/action_types/user_action_types';
import AuthService from '../../../services/AuthService';
import NavigationService from '../../../services/NavigationService';
import {subscriptionService} from '../../../services/subscriptionService';
import {getString} from '../../../utils/Converter';
import storage from './../../../services/StorageService';

const SetPassCode: React.FC = () => {
  const [code, setCode] = useState<string>();
  const [baseCode, setBaseCode] = useState<string>();
  const userState = useSelector<IGloablState>(
    state => state.UserReducer,
  ) as IUserState;
  const AuthState = useSelector<AuthState>(
    state => state.AuthReducer,
  ) as IAuthState;
  const dispatch = useDispatch();

  const savePassData = async (prev: string) => {
    if (prev !== baseCode) {
      dispatch(PUSH('არასწორი პას კოდი'));
      setCode(undefined);
      setBaseCode(undefined);
      return;
    }
    await storage.setItem('PassCode', getString(baseCode));
    await storage.setItem('PassCodeEnbled', '1');
    const {accesToken, refreshToken} = AuthState;

    AuthService.setToken(accesToken, refreshToken);
    subscriptionService.sendData(SUBSCRIBTION_KEYS.PWDCODE_UPDATED, true);
    NavigationService.GoBack();
  };

  const setNum = (num: string) => {
    if (num === '-') {
      if (!code || code.length <= 0) return;
      setCode(prev => prev?.slice(0, prev.length - 1));
      return;
    }
    if (code && code?.length >= 4) return;

    let c = getString(code)?.concat(num);
    setCode(c);

    if (c.length === 4) {
      if (getString(baseCode).length === 0) {
        setBaseCode(c);
        setCode(undefined);
      } else if (getString(baseCode).length > 0) {
        savePassData(c);
      }
    }
  };

  const GoToFaceId = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <Image
          source={{uri: userState.userDetails?.imageUrl}}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.name}>
          {userState.userDetails?.name} {userState.userDetails?.surname}
        </Text>
        <Text style={styles.status}>
          {getString(baseCode).length > 0
            ? 'გაიმეორე პასკოდი'
            : 'შეიყვანა ახალი პასკოდი'}
        </Text>
      </View>
      <View style={styles.dots}>
        <View
          style={[styles.dot, code && code[0] ? styles.activeDot : {}]}></View>
        <View
          style={[styles.dot, code && code[1] ? styles.activeDot : {}]}></View>
        <View
          style={[styles.dot, code && code[2] ? styles.activeDot : {}]}></View>
        <View
          style={[styles.dot, code && code[3] ? styles.activeDot : {}]}></View>
      </View>
      <View style={styles.pad}>
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={setNum.bind(this, '1')}
            style={styles.keyNum}>
            <Text style={styles.num}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={setNum.bind(this, '2')}
            style={styles.keyNum}>
            <Text style={styles.num}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={setNum.bind(this, '3')}
            style={styles.keyNum}>
            <Text style={styles.num}>3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={setNum.bind(this, '4')}
            style={styles.keyNum}>
            <Text style={styles.num}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={setNum.bind(this, '5')}
            style={styles.keyNum}>
            <Text style={styles.num}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={setNum.bind(this, '6')}
            style={styles.keyNum}>
            <Text style={styles.num}>6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={setNum.bind(this, '7')}
            style={styles.keyNum}>
            <Text style={styles.num}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={setNum.bind(this, '8')}
            style={styles.keyNum}>
            <Text style={styles.num}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={setNum.bind(this, '9')}
            style={styles.keyNum}>
            <Text style={styles.num}>9</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity onPress={GoToFaceId} style={styles.keyNum}>
            <Image
              source={require('./../../../assets/images/icon-face-id-72x72.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={setNum.bind(this, '0')}
            style={styles.keyNum}>
            <Text style={styles.num}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={setNum.bind(this, '-')}
            style={styles.keyNum}>
            <Text style={styles.del}>წაშლა</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 47,
    paddingBottom: tabHeight,
    backgroundColor: colors.white,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  user: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 35.5,
  },
  name: {
    marginTop: 12,
    fontFamily: 'FiraGO-Bold',
    fontSize: 18,
    lineHeight: 21,
  },
  status: {
    marginTop: 20,
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: colors.inputBackGround,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  activeDot: {
    backgroundColor: colors.black,
  },
  pad: {
    width: 280,
    alignSelf: 'center',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  keyNum: {
    backgroundColor: '#F1F1F1',
    width: 72,
    height: 72,
    borderRadius: 35.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  num: {
    fontFamily: 'FiraGO-Book',
    fontSize: 24,
    lineHeight: 29,
    color: colors.black,
  },
  del: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
});

export default SetPassCode;
