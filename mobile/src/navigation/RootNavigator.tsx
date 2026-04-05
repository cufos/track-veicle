import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import VehiclesStack from "./VehiclesStack";
import AlertsStack from "./AlertsStack";
import SettingsStack from "./SettingsStack";

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false as boolean,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Vehículos"
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
        name="Alertas"
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
        name="Ajustes"
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
