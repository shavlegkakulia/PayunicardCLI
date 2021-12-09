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
import PasswordChangeSucces from '../screens/landing/password/change/PasswordChangeSucces';
import PasswordChangeStepFour from '../screens/landing/password/change/PasswordChangeStepFour';
import AgreeTerm from '../screens/landing/signup/signup-agree';
import { useSelector } from 'react-redux';
import { ITranslateState, IGlobalState as ITranslateGlobalState } from '../redux/action_types/translate_action_types';

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
            title: translate.t("signup.title"),
            backText: translate.t("common.back")
          })
        }
      />
      <LandingStack.Screen
        name={Routes.SignupStepTwo}
        component={SignupStepTwo}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: 'რეგისტრაცია',
            backText: translate.t("common.back")
          })
        }
      />
      <LandingStack.Screen
        name={Routes.SignupStepThree}
        component={SignupStepThree}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: 'რეგისტრაცია',
            backText: translate.t("common.back")
          })
        }
      />
      <LandingStack.Screen
        name={Routes.SignupSteOtp}
        component={SignupSteOtp}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: 'რეგისტრაცია',
            backText: translate.t("common.back")
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
            title: 'პაროლის დარესეტება',
            backText: translate.t("common.back")
          })
        }
      />
      <LandingStack.Screen
        name={Routes.PasswordResetStepTwo}
        component={PasswordResetStepTwo}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: 'პაროლის დარესეტება',
            backText: translate.t("common.back")
          })
        }
      />
      <LandingStack.Screen
        name={Routes.PasswordResetStepThree}
        component={PasswordResetStepThree}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: 'პაროლის დარესეტება',
            backText: translate.t("common.back")
          })
        }
      />
      <LandingStack.Screen
        name={Routes.ResetPasswordOtp}
        component={ResetPasswordOtp}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: 'პაროლის დარესეტება',
            backText: translate.t("common.back")
          })
        }
      />
      <LandingStack.Screen
        name={Routes.PasswordResetStepFour}
        component={PasswordResetStepFour}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: 'პაროლის დარესეტება',
            backText: translate.t("common.back")
          })
        }
      />
      <LandingStack.Screen
        name={Routes.PasswordResetSucces}
        component={PasswordResetSucces}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: 'პაროლის დარესეტება',
            hideHeader: true,
            backText: translate.t("common.back")
          })
        }
      />
      <LandingStack.Screen
        name={Routes.setLoginWithPassCode}
        component={setLoginWithPassCode}
      />
      <LandingStack.Screen
        name={Routes.PasswordChangeSucces}
        component={PasswordChangeSucces}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: 'პაროლის შეცვლა',
            hideHeader: true,
            backText: translate.t("common.back")
          })
        }
      />
      <LandingStack.Screen
        name={Routes.PasswordChangeStepFour}
        component={PasswordChangeStepFour}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: 'პაროლის შეცვლა',
            backText: translate.t("common.back")
          })
        }
      />
       <LandingStack.Screen
        name={Routes.AgreeTerm}
        component={AgreeTerm}
        options={props =>
          UnauthScreenOptionsDrawer({
            navigation: props.navigation,
            title: 'წესები და პირობები',
            backText: translate.t("common.back")
          })
        }
      />
    </LandingStack.Navigator>
  );
}

export default LandingNavigator;
