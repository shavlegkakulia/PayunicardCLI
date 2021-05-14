import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/dashboard/dashboard';
import Transfers from '../screens/dashboard/transfers';
import React from 'react'
const DashboardTab = createBottomTabNavigator();

const DashboardTabNavigator = () =>   (
      <DashboardTab.Navigator>
        <DashboardTab.Screen name="Dashboard" component={Dashboard} />
        <DashboardTab.Screen name="Transfers" component={Transfers} />
      </DashboardTab.Navigator>
    );
  

export default DashboardTabNavigator;