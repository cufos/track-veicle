import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VehiclesStack from './VehiclesStack';
import AlertsStack from './AlertsStack';
import SettingsStack from './SettingsStack'

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Vehículos" component={VehiclesStack} />
      <Tab.Screen name="Alertas" component={AlertsStack} />
      <Tab.Screen name="Ajustes" component={SettingsStack} />
    </Tab.Navigator>
  );
}
