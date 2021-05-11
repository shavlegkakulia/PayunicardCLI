import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Dashboard from '../screens/dashboard/index';
import Transfers from '../screens/dashboard/transfers';


const TabNavigator = createBottomTabNavigator({
    Dashboard: Dashboard,
    Transfers: Transfers
}, screenOptions={{ headerShown: false }});

export default createAppContainer(TabNavigator);