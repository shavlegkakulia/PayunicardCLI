import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react'
import Landing from '../screens/landing/landing';
import Login from '../screens/landing/login';
import Signup from '../screens/landing/signup';

const LandingStack = createStackNavigator();

function LandingNavigator() {
  return (
    <LandingStack.Navigator>
      <LandingStack.Screen  name="Landing" component={Landing} />
      <LandingStack.Screen  name="Login" component={Login} />
      <LandingStack.Screen  name="Signup" component={Signup} />
    </LandingStack.Navigator>
  )
}

export default LandingNavigator;