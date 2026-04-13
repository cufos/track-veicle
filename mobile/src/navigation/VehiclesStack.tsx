import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VehiclesHomeScreen from "../screens/vehicles/VehiclesHomeScreen";
import AddVehicleScreen from "../screens/vehicles/AddVehicleScreen";
import VehicleDetailScreen from "../screens/vehicles/VehicleDetailScreen";
import AddMaintenanceScreen from "../screens/maintenances/AddMaintenanceScreen";

const Stack = createNativeStackNavigator();

export default function VehiclesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="VehiclesHome"
        component={VehiclesHomeScreen}
        options={{ title: "Vehículos" }}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={{ title: "Agregar Vehículo" }}
      />
      <Stack.Screen
        name="VehicleDetail"
        component={VehicleDetailScreen}
        options={{ title: "Detalle del Vehículo" }}
      />
      <Stack.Screen
        name="AddMaintenance"
        component={AddMaintenanceScreen}
        options={{
          title: "Agregar Mantenimiento",
          headerBackTitle: "Detalle",
        }}
      />
    </Stack.Navigator>
  );
}
