import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  RouteProp,
  useNavigation,
  useRoute,
  useTheme,
} from "@react-navigation/native";
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
  const { colors } = useTheme();

  const maintenances = getMaintenancesByVehicle(vehicle.id).sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return dateA - dateB;
  });

  const urgentMaintenances = maintenances
    .filter((m) => {
      const status = getMaintenanceStatus(m.dueDate, globalReminderDays);
      return status === "expired" || status === "upcoming";
    })
    .sort((a, b) => {
      const statusA = getMaintenanceStatus(a.dueDate, globalReminderDays);
      const statusB = getMaintenanceStatus(b.dueDate, globalReminderDays);

      // 🔴 Vencidos primero
      if (statusA === "expired" && statusB !== "expired") return -1;
      if (statusB === "expired" && statusA !== "expired") return 1;

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
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
        vehicle.imageUrl !== "local-motor" &&
        vehicle.imageUrl !== "local-default" && (
          <Image
            source={{ uri: vehicle.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <View style={styles.infoHeader}>
          <Text style={styles.name}>{vehicle.name}</Text>

          <TouchableOpacity
            style={styles.inlineEditButton}
            onPress={() => navigation.navigate("AddVehicle", { vehicle })}
          >
            <Text style={styles.inlineEditText}>✏️</Text>
          </TouchableOpacity>
        </View>

        <Text>
          {vehicle.brand} {vehicle.model}
        </Text>
        <Text>Año: {vehicle.year}</Text>
      </View>

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
        onPress={() => {
          Alert.alert(
            "Eliminar vehículo",
            "¿Estás seguro que quieres eliminar este vehículo? Esta acción no se puede deshacer.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                  await deleteVehicle(vehicle.id);
                  navigation.goBack();
                },
              },
            ],
          );
        }}
      >
        <Text style={styles.deleteButtonText}>Eliminar Vehículo</Text>
      </TouchableOpacity>

      {urgentMaintenances.length > 0 && (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Próximos mantenimientos</Text>
          </View>

          {urgentMaintenances.map((m) => {
            const status = getMaintenanceStatus(m.dueDate, globalReminderDays);

            const statusColor =
              status === "expired"
                ? "red"
                : status === "upcoming"
                  ? "orange"
                  : "green";

            return (
              <View key={m.id} style={styles.maintenanceCard}>
                <View style={styles.maintenanceHeader}>
                  <View style={styles.titleRow}>
                    <Text style={styles.maintenanceTitle}>{m.title}</Text>

                    <View
                      style={[
                        styles.urgentBadge,
                        {
                          backgroundColor:
                            status === "expired" ? "#FF3B30" : "#FF9500",
                        },
                      ]}
                    >
                      <Text style={styles.urgentBadgeText}>
                        {status === "expired" ? "Vencido" : "Próximo"}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("AddMaintenance", {
                        vehicleId: vehicle.id,
                        maintenance: m,
                      })
                    }
                  >
                    <Text style={styles.inlineEditText}>✏️</Text>
                  </TouchableOpacity>
                </View>

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
      )}

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={styles.sectionTitle}>Todos</Text>

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
              <View style={styles.maintenanceHeader}>
                <Text style={styles.maintenanceTitle}>{m.title}</Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AddMaintenance", {
                      vehicleId: vehicle.id,
                      maintenance: m,
                    })
                  }
                >
                  <Text style={styles.inlineEditText}>✏️</Text>
                </TouchableOpacity>
              </View>

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
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  inlineEditButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#00000010",
  },
  inlineEditText: {
    fontSize: 16,
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
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  seeAllText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  maintenanceCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  maintenanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  maintenanceTitle: {
    fontWeight: "bold",
  },
  urgentBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  urgentBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
});
