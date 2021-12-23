import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  EmitterSubscription,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import AppInput, {autoCapitalize} from './../../components/UI/AppInput';
import AppButton from './../../components/UI/AppButton';
import AppCheckbox from './../../components/UI/AppCheckbox';
import {useDispatch, useSelector} from 'react-redux';
import {Login} from './../../redux/actions/auth_actions';
import colors from '../../constants/colors';
import {
  AUT_SET_IS_LOADING,
  IAuthState,
  IGlobalState,
} from './../../redux/action_types/auth_action_types';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from './../../redux/action_types/translate_action_types';
import {use} from './../../redux/actions/translate_actions';
import Validation, {required} from './../../components/UI/Validation';
import LoginWithPassword from './loginWithPassword';
import storage from './../../services/StorageService';
import {AUTH_USER_INFO} from '../../constants/defaults';
import FullScreenLoader from '../../components/FullScreenLoading';
import {IUserDetails} from '../../services/UserService';
import {AppkeyboardAVoidScrollview} from '../../components/UI/AppkeyboardAVoidScrollview';
import NetworkService from '../../services/NetworkService';
import {useDimension} from '../../hooks/useDimension';
import AuthService, {IAuthorizationRequest} from '../../services/AuthService';
import {stringToObject} from '../../utils/utils';
import {require_otp, require_password_change} from '../../constants/errorCodes';
import FloatingLabelInput from '../../containers/otp/Otp';
import screenStyles from '../../styles/screens';
import Routes from '../../navigation/routes';
import {useNavigation} from '@react-navigation/native';
import SetLoginWithPassCode from './setLoginWithPassCode';

const CONTEXT_TYPE = 'login';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector<IGlobalState>(
    state => state.AuthReducer,
  ) as IAuthState;
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const timeoutObject = useRef<any>(null);
  const keyboardVisible = useRef<EmitterSubscription>();
  const [username, setUserName] = useState<string | undefined>('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(0);
  const [otp, setOtp] = useState<any>(null);
  const [focused, setFocused] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserDetails | null>({});
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [hasPasCode, setHasPasCode] = useState<boolean>(false);
  const [{access_token, refresh_token}, setTokens] = useState({
    access_token: '',
    refresh_token: '',
  });
  const dimension = useDimension();
  const navigation = useNavigation();

  const dismissLoginWIthPassword = () => {
    setUserInfo(null);
  };

  const hidePasscode = () => {
    setHasPasCode(false);
    setUserInfo(null);
  };

  useEffect(() => {
    storage
      .getItem(AUTH_USER_INFO)
      .then(user => {
        setUserInfo(user ? JSON.parse(user) : null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    storage
      .getItem('PassCodeEnbled')
      .then(async exists => {
        if (exists !== null) {
          const _access_token = await storage.getItem('access_token');
          const _refresh_token = await storage.getItem('refresh_token');
          if (_access_token && _refresh_token) {
            setHasPasCode(true);
            setTokens({
              access_token: _access_token,
              refresh_token: _refresh_token,
            });
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    keyboardVisible.current = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );

    return () => {
      keyboardVisible.current?.remove();
    };
  }, []);

  const _keyboardDidHide = () => {
    setFocused(false);
  };

  const _remember = useCallback(
    (isChecked: boolean) => {
      setRemember(isChecked ? 1 : 0);
    },
    [remember],
  );

  const login = async () => {
    if (Validation.validate(CONTEXT_TYPE)) {
      return;
    }
    if (state.isLoading || isUserLoading || isLoading) return;

    NetworkService.CheckConnection(() => {
      setIsUserLoading(true);
      let User: IAuthorizationRequest = {
        username: userInfo?.username || username,
        password,
        otp: otp,
      };
      AuthService.SignIn({User}).subscribe({
        next: Response => {
          console.log(Response.data);
          dispatch(
            Login(
              Response.data.access_token,
              Response.data.refresh_token,
              remember ? true : false,
            ),
          );
        },
        error: error => {
          if (
            stringToObject(error.response).data.error ===
            require_password_change
          ) {
            dispatch({type: AUT_SET_IS_LOADING, isLoading: false});
            setIsUserLoading(false);
            navigation.navigate(Routes.PasswordChangeStepFour, {
              backRoute: Routes.Login,
              minimizedContent: true,
              systemRequired: true,
            });
          }
          if (stringToObject(error.response).data.error === require_otp) {
            setOtpVisible(true);
          }
          dispatch({type: AUT_SET_IS_LOADING, isLoading: false});
          setIsUserLoading(false);
          setIsLoading(false);
        },
        complete: () => {
          setOtp(null);
          setIsLoading(true);
          setOtpVisible(false);
          setIsUserLoading(false);
          dispatch({type: AUT_SET_IS_LOADING, isLoading: false});
        },
      });
    });
  };

  const onResendOtp = () => {
    setOtp(null);
    login();
  };

  const sendOtp = () => {
    setIsLoading(true);
    login();
  }

  const changeUsername = useCallback(
    (username: string) => {
      setUserName(username);
    },
    [username],
  );

  const changePassword = useCallback(
    (password: string) => {
      setPassword(password);
    },
    [password],
  );

  const onFocus = useCallback(() => {
    if (timeoutObject.current) {
      clearTimeout(timeoutObject.current);
    }
    setFocused(true);
  }, [focused]);

  const onBlur = useCallback(() => {
    if (timeoutObject.current) {
      clearTimeout(timeoutObject.current);
    }
    timeoutObject.current = setTimeout(() => {
      setFocused(false);
    }, 100);
  }, [focused]);

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.authorizeText}>
          {translate.t('login.authorization')}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            dispatch(use(translate.next()));
          }}>
          <Text style={styles.langSwitchText}>{`Switch to ${
            translate.key === 'en' ? 'GE' : 'EN'
          }`}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (otpVisible) {
        setOtpVisible(false);
        setIsUserLoading(false);
        setIsLoading(false);
        return true;
      } else {
        return false;
      }
    });

    return () => sub.remove();
  }, [otpVisible]);

  if (otpVisible) {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={0}
        style={styles.avoid}>
        <View style={[screenStyles.wraper, styles.container]}>
          <View style={styles.content}>
            <FloatingLabelInput
              Style={styles.otpBox}
              label={translate.t('otp.smsCode')}
              title={translate.t('otp.otpSentBlank')}
              value={otp}
              onChangeText={otp => setOtp(otp)}
              onRetry={onResendOtp}
              resendTitle={translate.t('otp.resend')}
            />
          </View>
          <AppButton
            style={styles.button}
            onPress={sendOtp}
            isLoading={state.isLoading || isLoading}
            title={translate.t('common.confirm')}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  const NavigateToRegister = () => {
    navigation.navigate(Routes.Signup);
  };

  const NavigateToResetPassword = () => {
    navigation.navigate(Routes.ResetPassword);
  };

  if (isLoading || hasPasCode === undefined) {
    return <FullScreenLoader />;
  }

  let buttonContainerStyle = focused
    ? {...styles.buttonContainer, marginBottom: 15}
    : {...styles.buttonContainer};

  const imgHeight = dimension.height < 735 ? {height: 100} : {};

  return (
    <AppkeyboardAVoidScrollview>
      <View style={styles.container}>
        <Header />
        {hasPasCode ? (
          <SetLoginWithPassCode
            UserData={userInfo}
            access_token={access_token}
            refresh_token={refresh_token}
            onDismiss={hidePasscode}
          />
        ) : userInfo ? (
          <LoginWithPassword
            UserData={userInfo}
            userPassword={password}
            onSetPassword={setPassword}
            onLogin={login}
            isLoading={isUserLoading}
            onDismiss={dismissLoginWIthPassword}
          />
        ) : (
          <View style={{flex: 1, justifyContent: 'space-between'}}>
            <Text style={styles.welcomeText}>
              {translate.t('login.welcome')}
            </Text>
            {!focused && (
              <View style={styles.imageContainer}>
                <Image
                  resizeMode={'contain'}
                  style={[imgHeight]}
                  source={require('./../../assets/images/LoginScreen_1.png')}
                />
              </View>
            )}
            <View style={styles.inputsContainer}>
              <AppInput
                placeholder={translate.t('login.usernameEmail')}
                onBlur={onBlur}
                onFocus={onFocus}
                value={username}
                requireds={[required]}
                customKey="username"
                context={CONTEXT_TYPE}
                onChange={username => {
                  changeUsername(username);
                }}
                autoCapitalize={autoCapitalize.none}
                style={styles.firstInput}
              />
              <AppInput
                placeholder={translate.t('login.password')}
                onBlur={onBlur}
                onFocus={onFocus}
                value={password}
                requireds={[required]}
                customKey="password"
                context={CONTEXT_TYPE}
                secureTextEntry={true}
                onChange={password => {
                  changePassword(password);
                }}
              />
            </View>
            <View style={styles.toolContainer}>
              <AppCheckbox
                label={translate.t('login.remember')}
                labelStyle={styles.forgotLabelColor}
                activeColor={colors.primary}
                customKey="remember"
                context={CONTEXT_TYPE}
                value={remember != 0}
                clicked={_remember}
              />
              <AppButton
                backgroundColor={`${colors.white}`}
                color={`${colors.black}`}
                style={styles.forgotPasswordHandler}
                TextStyle={styles.forgotLabel}
                title={translate.t('login.forgotpassword')}
                onPress={NavigateToResetPassword}
              />
            </View>
            <View style={buttonContainerStyle}>
              <AppButton
                title={translate.t('login.login')}
                onPress={login}
                isLoading={state.isLoading || isUserLoading}
              />

              <AppButton
                backgroundColor={`${colors.white}`}
                color={`${colors.black}`}
                style={styles.btnForgotPassword}
                title={translate.t('login.signup')}
                onPress={NavigateToRegister}
              />
            </View>
          </View>
        )}
      </View>
    </AppkeyboardAVoidScrollview>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: '100%',
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    width: '100%',
  },
  avoid: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  authorizeText: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 16,
    color: colors.black,
  },
  langSwitchText: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 16,
    color: colors.black,
  },
  welcomeText: {
    marginBottom: 25,
    fontFamily: 'FiraGO-Bold',
    fontSize: 24,
    lineHeight: 28,
    color: colors.black,
  },
  imageContainer: {
    backgroundColor: colors.white,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  inputsContainer: {
    marginBottom: 10,

    justifyContent: 'space-between',
  },
  firstInput: {
    marginBottom: 22,
  },
  toolContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 20,
  },
  forgotLabel: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 12,
    lineHeight: 17,
    color: colors.labelColor,
  },
  forgotLabelColor: {
    color: colors.labelColor,
  },
  btnForgotPassword: {
    marginTop: 5,
  },
  forgotPasswordHandler: {
    bottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 0,
  },
  otpBox: {
    flex: 1,
    marginTop: 150,
  },
  otpBoxView: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  button: {
    marginVertical: 40,
  },
});

export default LoginForm;
