import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useVehicles } from "../../context/VehiclesContext";
import { useMaintenances } from "../../context/MaintenancesContext";
import { getMaintenanceStatus } from "../../utils/dateUtils";
import { useTheme } from "@react-navigation/native";

export default function AlertsHomeScreen() {
  const { vehicles } = useVehicles();
  const { maintenances } = useMaintenances();
  const { colors } = useTheme();

  const [filter, setFilter] = useState<"all" | "expired" | "upcoming">("all");

  const getVehicleMaintenances = (vehicleId: string) =>
    maintenances.filter((m) => m.vehicleId === vehicleId);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter("all")}>
          <Text style={filter === "all" ? styles.activeFilter : styles.filter}>
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("expired")}>
          <Text
            style={filter === "expired" ? styles.activeFilter : styles.filter}
          >
            Vencidas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("upcoming")}>
          <Text
            style={filter === "upcoming" ? styles.activeFilter : styles.filter}
          >
            Próximas
          </Text>
        </TouchableOpacity>
      </View>

      {vehicles.map((vehicle) => {
        const vehicleMaintenances = getVehicleMaintenances(vehicle.id)
          .filter((m) => {
            const status = getMaintenanceStatus(
              m.dueDate,
              m.reminderDaysBefore,
            );

            if (filter === "all") return status !== "ok";
            if (filter === "expired") return status === "expired";
            if (filter === "upcoming") return status === "upcoming";
            return false;
          })
          .sort((a, b) => {
            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();
            return dateA - dateB;
          });

        if (vehicleMaintenances.length === 0) return null;

        return (
          <View key={vehicle.id} style={styles.vehicleSection}>
            <Text style={[styles.vehicleTitle, { color: colors.text }]}>
              {vehicle.name}
            </Text>

            {vehicleMaintenances.map((m) => {
              const status = getMaintenanceStatus(
                m.dueDate,
                m.reminderDaysBefore,
              );

              const statusColor = status === "expired" ? "red" : "orange";

              return (
                <View
                  key={m.id}
                  style={[styles.alertCard, { backgroundColor: colors.card }]}
                >
                  <Text style={[styles.alertTitle, { color: colors.text }]}>
                    {m.title}
                  </Text>
                  <Text style={{ color: colors.text }}>Vence: {m.dueDate}</Text>
                  <Text style={{ color: statusColor }}>
                    {status === "expired" ? "Vencido" : "Próximo a vencer"}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}

      {maintenances.filter(
        (m) => getMaintenanceStatus(m.dueDate, m.reminderDaysBefore) !== "ok",
      ).length === 0 && (
        <Text
          style={{
            color: colors.text,
            textAlign: "center",
            marginTop: 24,
          }}
        >
          No hay alertas activas 🎉
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerImage: {
    width: "100%",
    height: 120,
    marginBottom: 16,
  },
  vehicleSection: {
    marginBottom: 20,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  alertCard: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  alertTitle: {
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  filter: {
    color: "#666",
    fontWeight: "bold",
  },
  activeFilter: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
