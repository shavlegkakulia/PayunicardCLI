
import LandingNavigator from './LandingNavigation';
import DashboardNavigatorTab from './DashboardNavigation';
import SplashScreen from './../components/SplashScreen';
import { IAuthState, LOGIN } from './../redux/action_types/auth_action_types';
import { Register } from './../utils/axios.interceptor';
import { use } from './../redux/actions/translate_actions';
import { LANG_KEY } from './../constants/defaults';
import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState, FC } from 'react';
import {
  NavigationContainer
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';

interface IState {
  AuthReducer: IAuthState
}

const DashboardStack = createStackNavigator();

const DashboardNavigator = () => (
  <DashboardStack.Navigator>
    <DashboardStack.Screen 
    name="Dashboard"
    component={DashboardNavigatorTab} />
  </DashboardStack.Navigator>
);

const AppContainer: FC = () => {
  const state = useSelector<IState>(state => state.AuthReducer) as IAuthState;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState("");
  
  useEffect(() => {
    dispatch(use(LANG_KEY))
  }, [])

  useEffect(() => {
    AsyncStorage.getItem("access_token").then(data => {
        setUserToken(data || "");
        if(data) {
          dispatch({ type: LOGIN, accesToken: data, isAuthenticated: true });
        }
        Register();
        setIsLoading(false);
    })
  }, [userToken, state.accesToken])

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer >
      {!userToken ? <LandingNavigator /> : <DashboardNavigator />}
    </NavigationContainer>
  )
}


export default AppContainer;