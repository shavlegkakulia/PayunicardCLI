
import MainNavigation from './MainNavigation';
import AppNavigatorTab from './AppNavigation';
import AuthLoading from './../screens/AuthLoadingScreen';
import {
    createSwitchNavigator,
    createAppContainer
  } from 'react-navigation';

const AppContainer = createAppContainer(
    createSwitchNavigator(
            {
                Starter: AuthLoading,
                Main: MainNavigation,
                App: AppNavigatorTab
            },
            {
                initialRouteName: 'Starter'
            }
        )
    );

export default AppContainer;