import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Vehicle } from "../../models/types";
import { useMaintenances } from "../../context/MaintenancesContext";
import { useVehicles } from "../../context/VehiclesContext";
import { getMaintenanceStatus } from "../../utils/dateUtils";
import { useSettings } from "../../context/SettingsContext";

type ParamList = {
  VehicleDetail: { vehicle: Vehicle };
};

export default function VehicleDetailScreen() {
  const route = useRoute<RouteProp<ParamList, "VehicleDetail">>();
  const navigation = useNavigation<any>();
  const { vehicle } = route.params;
  const { getMaintenancesByVehicle } = useMaintenances();
  const { globalReminderDays } = useSettings();
  const { deleteVehicle } = useVehicles();

  const maintenances = getMaintenancesByVehicle(vehicle.id).sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return dateA - dateB;
  });

  return (
    <ScrollView style={styles.container}>
      {vehicle.imageUrl === "local-van" && (
        <Image
          source={require("../../../assets/van.png")}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      {vehicle.imageUrl === "local-motor" && (
        <Image
          source={require("../../../assets/motor.png")}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      {vehicle.imageUrl === "local-default" && (
        <Image
          source={require("../../../assets/carro_defecto.png")}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      {vehicle.imageUrl &&
        vehicle.imageUrl !== "local-van" &&
        vehicle.imageUrl !== "local-motor" && (
          <Image
            source={{ uri: vehicle.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

      <TouchableOpacity style={styles.infoCard}>
        <Text style={styles.name}>{vehicle.name}</Text>
        <Text>
          {vehicle.brand} {vehicle.model}
        </Text>
        <Text>Año: {vehicle.year}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("AddMaintenance", { vehicleId: vehicle.id })
        }
      >
        <Text style={styles.addButtonText}>+ Agregar Mantenimiento</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={async () => {
          await deleteVehicle(vehicle.id);
          navigation.goBack();
        }}
      >
        <Text style={styles.deleteButtonText}>Eliminar Vehículo</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mantenimientos</Text>

        {maintenances.length === 0 && (
          <Text style={{ color: "#666" }}>
            No hay mantenimientos registrados
          </Text>
        )}

        {maintenances.map((m) => {
          const status = getMaintenanceStatus(m.dueDate, globalReminderDays);

          const statusColor =
            status === "expired"
              ? "red"
              : status === "upcoming"
                ? "orange"
                : "green";

          return (
            <View key={m.id} style={styles.maintenanceCard}>
              <Text style={styles.maintenanceTitle}>{m.title}</Text>
              <Text>Vence: {m.dueDate}</Text>
              <Text style={{ color: statusColor }}>
                {status === "expired"
                  ? "Vencido"
                  : status === "upcoming"
                    ? "Próximo a vencer"
                    : "En regla"}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoCard: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  section: {
    padding: 16,
    backgroundColor: "#fafafa",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  maintenanceCard: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  maintenanceTitle: {
    fontWeight: "bold",
  },
});
