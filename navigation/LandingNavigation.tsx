import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Landing from '../screens/landing/landing';
import Login from '../screens/landing/login';
import Signup from '../screens/landing/signup/signup';
import FirstLoad from '../screens/landing/firstLoad';
import Routes from './routes';
import SignupStepTwo from '../screens/landing/signup/signup-step-2';
import SignupStepThree from '../screens/landing/signup/signup-step-3';
import SignupSteOtp from '../screens/landing/signup/SignupSteOtp';
import {UnauthScreenOptionsDrawer} from './Header';
import PasswordReset from '../screens/landing/password/PasswordReset';
import PasswordResetStepTwo from '../screens/landing/password/PasswordResetStepTwo';
import PasswordResetStepThree from '../screens/landing/password/PasswordResetStepThree';
import ResetPasswordOtp from '../screens/landing/password/ResetPasswordOtp';
import PasswordResetStepFour from '../screens/landing/password/PasswordResetStepFour';
import PasswordResetSucces from '../screens/landing/password/PasswordResetSucces';
import setLoginWithPassCode from '../screens/landing/setLoginWithPassCode';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../redux/action_types/translate_action_types';
import { useSelector } from 'react-redux';

const LandingStack = createStackNavigator();

function LandingNavigator() {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  return (
    <LandingStack.Navigator
      initialRouteName={Routes.Landing}
      screenOptions={{
        headerShown: false,
      }}>
      <LandingStack.Screen name={Routes.Landing} component={Landing} />
      <LandingStack.Screen name={Routes.Login} component={Login} />
      <LandingStack.Screen
        name={Routes.Signup}
        component={Signup}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: translate.t('login.signup'),
          })
        }
      />
      <LandingStack.Screen
        name={Routes.SignupStepTwo}
        component={SignupStepTwo}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: translate.t('login.signup'),
          })
        }
      />
      <LandingStack.Screen
        name={Routes.SignupStepThree}
        component={SignupStepThree}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: translate.t('login.signup'),
          })
        }
      />
      <LandingStack.Screen
        name={Routes.SignupSteOtp}
        component={SignupSteOtp}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: translate.t('login.signup'),
          })
        }
      />
      <LandingStack.Screen name={Routes.FirstLoad} component={FirstLoad} />
      <LandingStack.Screen
        name={Routes.ResetPassword}
        component={PasswordReset}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: translate.t('forgotPassword.resetPassword'),
          })
        }
      />
      <LandingStack.Screen
        name={Routes.PasswordResetStepTwo}
        component={PasswordResetStepTwo}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: translate.t('forgotPassword.resetPassword'),
          })
        }
      />
      <LandingStack.Screen
        name={Routes.PasswordResetStepThree}
        component={PasswordResetStepThree}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: translate.t('forgotPassword.resetPassword'),
          })
        }
      />
      <LandingStack.Screen
        name={Routes.ResetPasswordOtp}
        component={ResetPasswordOtp}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: translate.t('forgotPassword.resetPassword'),
          })
        }
      />
      <LandingStack.Screen
        name={Routes.PasswordResetStepFour}
        component={PasswordResetStepFour}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: translate.t('forgotPassword.resetPassword'),
          })
        }
      />
      <LandingStack.Screen
        name={Routes.PasswordResetSucces}
        component={PasswordResetSucces}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: translate.t('forgotPassword.resetPassword'),
            hideHeader: true,
          })
        }
      />
      <LandingStack.Screen
        name={Routes.setLoginWithPassCode}
        component={setLoginWithPassCode}
      />
    </LandingStack.Navigator>
  );
}

export default LandingNavigator;
