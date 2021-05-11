import { createStackNavigator } from 'react-navigation-stack';

import Main from '../screens/main/main';
import Login from '../screens/main/login';
import Signup from '../screens/main/signup';

const MainNavigationStack = createStackNavigator({ 
  Main: Main, 
  Login: Login,
  Signup: Signup
});

export default MainNavigationStack;