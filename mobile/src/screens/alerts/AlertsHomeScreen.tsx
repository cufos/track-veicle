import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { useVehicles } from "../../context/VehiclesContext";
import { useMaintenances } from "../../context/MaintenancesContext";
import { getMaintenanceStatus } from "../../utils/dateUtils";
import {
  useTheme,
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";

type ParamList = {
  Alerts: { vehicleId?: string };
};

export default function AlertsHomeScreen() {
  const { vehicles } = useVehicles();
  const { maintenances } = useMaintenances();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ParamList, "Alerts">>();
  const vehicleIdFilter = route.params?.vehicleId;

  const [filter, setFilter] = useState<"all" | "expired" | "upcoming">("all");

  const getVehicleMaintenances = (vehicleId: string) =>
    maintenances.filter((m) => m.vehicleId === vehicleId);

  const filteredVehicle = vehicleIdFilter
    ? vehicles.find((v) => v.id === vehicleIdFilter)
    : null;

  const breadcrumbOpacity = React.useRef(new Animated.Value(0)).current;
  const breadcrumbTranslate = React.useRef(new Animated.Value(-10)).current;

  React.useEffect(() => {
    if (filteredVehicle) {
      Animated.parallel([
        Animated.timing(breadcrumbOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(breadcrumbTranslate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [filteredVehicle]);

  React.useLayoutEffect(() => {
    if (filteredVehicle) {
      navigation.setOptions({
        title: `${filteredVehicle.name} - Mantenimientos`,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Vehículos")}
            style={{ marginRight: 10 }}
          >
            <Text style={{ color: "#007AFF", fontWeight: "600" }}>
              ← Volver
            </Text>
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({
        title: "Alertas",
        headerLeft: undefined,
      });
    }
  }, [filteredVehicle, navigation]);

  return (
    <ScrollView style={styles.container}>
      {filteredVehicle && (
        <Animated.View
          style={[
            styles.breadcrumbContainer,
            {
              opacity: breadcrumbOpacity,
              transform: [{ translateY: breadcrumbTranslate }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Vehículos", {
                screen: "VehicleDetail",
                params: { vehicle: filteredVehicle },
              })
            }
          >
            <Text style={[styles.breadcrumbText, { color: "#007AFF" }]}>
              {filteredVehicle.name}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.breadcrumbSeparator, { color: colors.text }]}>
            {" > "} Mantenimientos
          </Text>
        </Animated.View>
      )}

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

      {vehicles
        .filter((v) => (vehicleIdFilter ? v.id === vehicleIdFilter : true))
        .map((vehicle) => {
          const vehicleMaintenances = getVehicleMaintenances(vehicle.id)
            .filter((m) => {
              const status = getMaintenanceStatus(
                m.dueDate,
                m.reminderDaysBefore,
              );

              if (filter === "all") return true; // ✅ Mostrar todos
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
                    style={[
                      styles.alertCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.alertHeader}>
                      <Text style={[styles.alertTitle, { color: colors.text }]}>
                        {m.title}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Vehículos", {
                            screen: "AddMaintenance",
                            params: {
                              vehicleId: vehicle.id,
                              maintenance: m,
                            },
                          })
                        }
                      >
                        <Text style={styles.inlineEditText}>✏️</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={{ color: colors.text }}>
                      Vence: {m.dueDate}
                    </Text>
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
          );
        })}

      {filter !== "all" &&
        maintenances.filter((m) =>
          filter === "expired"
            ? getMaintenanceStatus(m.dueDate, m.reminderDaysBefore) ===
              "expired"
            : getMaintenanceStatus(m.dueDate, m.reminderDaysBefore) ===
              "upcoming",
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
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  alertTitle: {
    fontWeight: "bold",
  },
  inlineEditText: {
    fontSize: 16,
  },
  breadcrumbContainer: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumbText: {
    fontSize: 14,
    fontWeight: "600",
  },
  breadcrumbSeparator: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
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
