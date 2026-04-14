import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import VehiclesStack from "./VehiclesStack";
import AlertsStack from "./AlertsStack";
import SettingsStack from "./SettingsStack";
import i18n from "../i18n";
import { useSettings } from "../context/SettingsContext";

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  const { language } = useSettings();

  return (
    <Tab.Navigator
      key={language}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name={i18n.t("vehicle.screenTitle")}
        component={VehiclesStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Image
              source={require("../../assets/maintenance.png")}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name={i18n.t("alerts.screenTitle")}
        component={AlertsStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Image
              source={require("../../assets/calendar.png")}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name={i18n.t("settings.screenTitle")}
        component={SettingsStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Image
              source={require("../../assets/mechanic.png")}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
