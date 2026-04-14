import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VehiclesHomeScreen from "../screens/vehicles/VehiclesHomeScreen";
import AddVehicleScreen from "../screens/vehicles/AddVehicleScreen";
import VehicleDetailScreen from "../screens/vehicles/VehicleDetailScreen";
import AddMaintenanceScreen from "../screens/maintenances/AddMaintenanceScreen";
import i18n from "../i18n";
import { useSettings } from "../context/SettingsContext";

const Stack = createNativeStackNavigator();

export default function VehiclesStack() {
  const { language } = useSettings();

  return (
    <Stack.Navigator
      key={language}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="VehiclesHome"
        component={VehiclesHomeScreen}
        options={{ title: i18n.t("vehicle.screenTitle") }}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={{ title: i18n.t("vehicle.addVehicle") }}
      />
      <Stack.Screen
        name="VehicleDetail"
        component={VehicleDetailScreen}
        options={{ title: i18n.t("vehicle.vehicleDetail") }}
      />
      <Stack.Screen
        name="AddMaintenance"
        component={AddMaintenanceScreen}
        options={{
          title: i18n.t("vehicle.addMaintenance"),
          headerBackTitle: i18n.t("vehicle.vehicleDetail"),
        }}
      />
    </Stack.Navigator>
  );
}
