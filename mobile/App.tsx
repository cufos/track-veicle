import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { VehiclesProvider } from "./src/context/VehiclesContext";
import { MaintenancesProvider } from "./src/context/MaintenancesContext";
import { SettingsProvider, useSettings } from "./src/context/SettingsContext";

function AppContent() {
  const { theme } = useSettings();
  const isDark = theme === "dark";

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#000000" : "#FFFFFF"}
      />
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
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
