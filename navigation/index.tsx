import React, {useEffect, useState, FC, useCallback, useRef} from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import FullScreenLoader from './../components/FullScreenLoading';
import LandingNavigator from './LandingNavigation';
import {
  IAuthState,
  IGlobalState as AuthState,
  SET_AUTH,
} from './../redux/action_types/auth_action_types';
import AuthService, {IInterceptop} from './../services/AuthService';
import CommonService from './../services/CommonService';
import {use} from './../redux/actions/translate_actions';
import {LOCALE_IN_STORAGE} from './../constants/defaults';
import ErrorWrapper from '../components/ErrorWrapper';
import storage from './../services/StorageService';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import PresentationServive from '../services/PresentationServive';
import AppStack from './AppStack';
import NavigationService from '../services/NavigationService';
import {SafeAreaView} from 'react-navigation';
import {StyleSheet} from 'react-native';
import colors from '../constants/colors';
import {ka_ge} from '../lang';
import {Logout} from '../redux/actions/auth_actions';
import {debounce, sleep} from '../utils/utils';
import UserInactivity from './../screens/activity';

interface ILoading {
  locale: boolean;
  translates: boolean;
}

const LogError = (error: string) => {
  let _error = error + '*' + new Date().toLocaleDateString();
  PresentationServive.LogError({error: _error}).subscribe({
    next: () => {},
    complete: () => {},
  });
};

const handleError = (error: Error, isFatal: boolean) => {};

LogError('fdsfdsfdfdfds');

setJSExceptionHandler((error, isFatal) => {
  handleError(error, isFatal);
}, true);

//For most use cases:
setNativeExceptionHandler(exceptionString => {
  // This is your custom global error handler
  // You do stuff likehit google analytics to track crashes.
  // or hit a custom api to inform the dev team.
  //NOTE: alert or showing any UI change via JS
  //WILL NOT WORK in case of NATIVE ERRORS.
});
//====================================================
// ADVANCED use case:
const exceptionhandler = (exceptionString: string) => {
  // your exception handler code here
};
setNativeExceptionHandler(exceptionhandler, false, true);

const AppContainer: FC = () => {
  const state = useSelector<AuthState>(
    state => state.AuthReducer,
  ) as IAuthState;
  const dispatch = useDispatch();
  const [loading, setIsLoading] = useState<ILoading>({
    locale: true,
    translates: true,
  });
  
  const AxiosInterceptorsSubscription = useRef<IInterceptop[]>([]);

  useEffect(() => {
    storage
      .getItem(LOCALE_IN_STORAGE)
      .then(locale => {
        dispatch(use(locale || ka_ge));
        setIsLoading(loading => {
          loading.locale = false;
          return loading;
        });
      })
      .catch(() =>
        setIsLoading(loading => {
          loading.locale = false;
          return loading;
        }),
      );
  }, []);

  useEffect(() => {
    AxiosInterceptorsSubscription.current = [
      CommonService.registerCommonInterceptor(),
      AuthService.registerAuthInterceptor(signOut),
    ];

    return () => {
      AxiosInterceptorsSubscription.current.forEach(sub => sub.unsubscribe());
    };
  }, []);

  const signoutDelay = debounce((e: Function) => e(), 1000);

  const signOut = useCallback(async () => {
    signoutDelay(() => {
      dispatch(Logout());
    });
    await AuthService.SignOut();
    await storage.removeItem('PassCode');
    await storage.removeItem('PassCodeEnbled');
  }, [state.isAuthenticated]);

 

  useEffect(() => {
    AuthService.isAuthenticated().then(res => {
      if(res===true){
        dispatch({type: SET_AUTH, setAuth: true})
      }
      setTimeout(() => {
        SplashScreen.hide();
      }, 500);
    })
  }, [])

  useEffect(() => {
   
    setIsLoading(loading => {
      loading.translates = false;
      return loading;
    });
    
  }, []);

  if (loading.locale || loading.translates) {
    return <FullScreenLoader />;
  }
console.log(loading)
  return (
    <ErrorWrapper>
    
        <UserInactivity timeForInactivity={60 * 1000} checkInterval={1000}>
          <NavigationContainer
            ref={(navigatorRef: NavigationContainerRef) => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}>
            <SafeAreaView style={styles.container}>
              <AppStack />
            </SafeAreaView>
          </NavigationContainer>
        </UserInactivity>
    </ErrorWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.baseBackgroundColor,
  },
});

export default AppContainer;
