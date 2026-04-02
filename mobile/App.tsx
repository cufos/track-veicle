import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { VehiclesProvider } from './src/context/VehiclesContext';
import { MaintenancesProvider } from './src/context/MaintenancesContext';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';

function AppContent() {
  const { theme } = useSettings();

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <VehiclesProvider>
        <MaintenancesProvider>
          <AppContent />
        </MaintenancesProvider>
      </VehiclesProvider>
    </SettingsProvider>
  );
}
