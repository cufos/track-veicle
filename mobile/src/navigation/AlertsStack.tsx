import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AlertsHomeScreen from '../screens/alerts/AlertsHomeScreen';

const Stack = createNativeStackNavigator();

export default function AlertsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AlertsHome"
        component={AlertsHomeScreen}
        options={{ title: 'Alertas' }}
      />
    </Stack.Navigator>
  );
}
