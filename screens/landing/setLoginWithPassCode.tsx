import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppButton from '../../components/UI/AppButton';
import colors from '../../constants/colors';
import {tabHeight} from '../../navigation/TabNav';
import {PUSH} from '../../redux/actions/error_action';
import {LOGIN} from '../../redux/action_types/auth_action_types';
import {
  IGlobalState,
  ITranslateState,
} from '../../redux/action_types/translate_action_types';
import {IUserDetails} from '../../services/UserService';
import {getString} from '../../utils/Converter';
import BiometricAuthScreen from '../dashboard/settings/biometric';
import storage from './../../services/StorageService';

interface IProps {
  access_token: string;
  refresh_token: string;
  UserData: IUserDetails | null;
  onDismiss: () => void;
}

const setLoginWithPassCode: React.FC<IProps> = props => {
  const [code, setCode] = useState<string>();
  const [baseCode, setBaseCode] = useState<string>();
  const [startBiometric, setStartBiometric] = useState<boolean>(false);
  const [biometricAvailable, setBiometricAvailable] = useState<boolean>(true);
  const translate = useSelector<IGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const dispatch = useDispatch();

  const setNum = (num: string) => {
    if (num === '-') {
      if (!code || code.length <= 0) return;
      setCode(prev => prev?.slice(0, prev.length - 1));
      return;
    }

    if (code && code?.length >= 4) return;

    let c = getString(code)?.concat(num);
    setCode(c);

    if (getString(c).length === 4) {
      login(c);
    }
  };

  const login = async (pascode: string) => {
    if (baseCode === pascode) {
      const {access_token, refresh_token} = props;
      dispatch({
        type: LOGIN,
        accesToken: access_token,
        refreshToken: refresh_token,
        isAuthenticated: true,
      });
    } else {
      dispatch(PUSH('არასწორი პას კოდი'));
      setCode(undefined);
    }
  };

  const onSuccesBiometric = () => {
    console.log('modis');
    const {access_token, refresh_token} = props;
    dispatch({
      type: LOGIN,
      accesToken: access_token,
      refreshToken: refresh_token,
      isAuthenticated: true,
    });
  };

  useEffect(() => {
    storage.getItem('PassCode').then(async data => {
      if (data !== null) {
        setBaseCode(data);
      }
    });
  }, []);

  const onBiometric = () => {
    if (startBiometric) {
      setStartBiometric(false);
      //return;
    }
    storage.getItem('Biometric').then(async data => {
      if (data !== null && biometricAvailable) {
        setStartBiometric(true);
      }
    });
  };

  useEffect(() => {
    onBiometric();
  }, []);

  const getStatus = (status: boolean, available?: boolean | undefined) => {
    if (available === false) setBiometricAvailable(false);
    if (!status) setStartBiometric(false);
  };

  return (
    <View style={styles.container}>
      <BiometricAuthScreen
        start={startBiometric}
        returnStatus={getStatus}
        onSucces={onSuccesBiometric.bind(this)}
      />
      <View style={styles.user}>
        <Image
          source={{uri: props.UserData?.imageUrl}}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.name}>
          {props.UserData?.name} {props.UserData?.surname}
        </Text>
        <AppButton
          TextStyle={styles.changeAccountText}
          style={styles.changeAccount}
          title={translate.t('login.loginWithAnother')}
          onPress={props.onDismiss}
        />
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
          <TouchableOpacity onPress={onBiometric} style={styles.keyNum}>
            <Image
              source={require('./../../assets/images/icon-face-id-72x72.png')}
              style={styles.otherImg}
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
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  otherImg: {
    width: 60,
    height: 60,
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
    width: 60,
    height: 60,
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
    fontSize: 12,
    lineHeight: 17,
    color: colors.black,
  },
  changeAccount: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    alignSelf: 'center',
    backgroundColor: '#FF8F0020',
    borderRadius: 10,
    marginVertical: 10,
  },
  changeAccountText: {
    fontFamily: 'FiraGO-Book',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 14,
    color: '#FF8F00',
  },
});

export default setLoginWithPassCode;
