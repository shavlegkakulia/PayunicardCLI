import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import Landing from '../screens/landing/landing';
import Login from '../screens/landing/login';
import Signup from '../screens/landing/signup';
import FirstLoad from '../screens/landing/firstLoad';

const LandingStack = createStackNavigator();

function LandingNavigator() {
  return (
    <LandingStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <LandingStack.Screen  name="Landing" component={Landing} />
      <LandingStack.Screen  name="Login" component={Login} />
      <LandingStack.Screen  name="Signup" component={Signup} />
      <LandingStack.Screen  name="FirstLoad" component={FirstLoad} />
    </LandingStack.Navigator>
  )
}

export default LandingNavigator;