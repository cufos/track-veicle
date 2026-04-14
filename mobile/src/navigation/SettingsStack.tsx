import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsHomeScreen from "../screens/settings/SettingsHomeScreen";
import i18n from "../i18n";
import { useSettings } from "../context/SettingsContext";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  const { language } = useSettings();

  return (
    <Stack.Navigator key={language}>
      <Stack.Screen
        name="SettingsHome"
        component={SettingsHomeScreen}
        options={{ title: i18n.t("settings.screenTitle") }}
      />
    </Stack.Navigator>
  );
}
