import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import Landing from '../screens/landing/landing';
import Login from '../screens/landing/login';
import Signup from '../screens/landing/signup';
import FirstLoad from '../screens/landing/firstLoad';
import Routes from './routes';

const LandingStack = createStackNavigator();

function LandingNavigator() {
  return (
    <LandingStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <LandingStack.Screen name={Routes.Landing} component={Landing} />
      <LandingStack.Screen name={Routes.Login} component={Login} />
      <LandingStack.Screen name={Routes.Signup} component={Signup} />
      <LandingStack.Screen name={Routes.FirstLoad} component={FirstLoad} />
    </LandingStack.Navigator>
  )
}

export default LandingNavigator;