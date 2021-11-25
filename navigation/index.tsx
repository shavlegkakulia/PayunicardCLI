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
  LOGIN,
} from './../redux/action_types/auth_action_types';
import AuthService, {IInterceptop} from './../services/AuthService';
import CommonService from './../services/CommonService';
import {use} from './../redux/actions/translate_actions';
import {LANG_KEY, LOCALE_IN_STORAGE} from './../constants/defaults';
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

interface ILoading {
  locale: boolean;
  translates: boolean;
}

const LogError = (error: string) => {
  console.log('***********************************');
  let _error = error + '*' + new Date().toLocaleDateString();
  PresentationServive.LogError({error: _error}).subscribe({
    next: () => {},
    //error: (err) => {console.log(err)},
    complete: () => {},
  });
};

const handleError = (error: Error, isFatal: boolean) => {
  //console.log(JSON.stringify(error), isFatal)
};

LogError('fdsfdsfdfdfds');

setJSExceptionHandler((error, isFatal) => {
  handleError(error, isFatal);
}, true);

//For most use cases:
setNativeExceptionHandler(exceptionString => {
  console.log('exceptionString', exceptionString);
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
  console.log('exceptionString', exceptionString);
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
  const [userToken, setUserToken] = useState<string>('');
  const AxiosInterceptorsSubscription = useRef<IInterceptop[]>([]);

  useEffect(() => {
    storage
      .getItem(LOCALE_IN_STORAGE)
      .then(locale => {
        dispatch(use(locale || LANG_KEY));
      })
      .finally(() =>
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

  const signOut = useCallback(async () => {
    await AuthService.SignOut();
    setUserToken('');
  }, [userToken]);

  useEffect(() => {
    AuthService.getToken().then(data => {
      setUserToken(data || '');

      if (data) {
        dispatch({type: LOGIN, accesToken: data, isAuthenticated: true});
      }

      setIsLoading(loading => {
        loading.translates = false;
        return loading;
      });
      SplashScreen.hide();
    });
  }, [userToken, state.accesToken]);

  if (loading.locale || loading.translates) {
    return <FullScreenLoader />;
  }

  return (
    <ErrorWrapper>
      {!userToken ? (
        <NavigationContainer>
          <LandingNavigator />
        </NavigationContainer>
      ) : (
        <NavigationContainer
          ref={(navigatorRef: NavigationContainerRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}>
          <SafeAreaView style={styles.container}>
            <AppStack />
          </SafeAreaView>
        </NavigationContainer>
      )}
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
