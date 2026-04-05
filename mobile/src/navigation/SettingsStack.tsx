import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsHomeScreen from "../screens/settings/SettingsHomeScreen";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsHome"
        component={SettingsHomeScreen}
        options={{ title: "Ajustes" }}
      />
    </Stack.Navigator>
  );
}
