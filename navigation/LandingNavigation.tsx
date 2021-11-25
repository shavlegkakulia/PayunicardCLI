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

const LandingStack = createStackNavigator();

function LandingNavigator() {
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
            title: 'რეგისტრაცია',
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
          })
        }
      />
    </LandingStack.Navigator>
  );
}

export default LandingNavigator;
