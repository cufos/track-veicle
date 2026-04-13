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
import StatusBadge from "../../components/StatusBadge";
import i18n from "../../i18n";
import { ImageSourcePropType } from "react-native";

type ParamList = {
  Alerts: { vehicleId?: string };
};

export default function AlertsHomeScreen() {
  const { vehicles } = useVehicles();
  const { maintenances } = useMaintenances();
  const { colors, dark } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ParamList, "Alerts">>();
  const vehicleIdFilter = route.params?.vehicleId ?? null;

  // ✅ Si el usuario toca directamente el TAB de Alertas,
  // limpiamos el filtro anterior.
  // Pero si viene desde "Ver todos", NO lo limpiamos.
  React.useEffect(() => {
    const parent = navigation.getParent();

    const unsubscribe = parent?.addListener("tabPress", () => {
      navigation.setParams({ vehicleId: undefined });
    });

    return unsubscribe;
  }, [navigation]);

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
        title: i18n.t("alerts.title"),
        headerLeft: undefined,
      });
    }
  }, [filteredVehicle, navigation]);

  const getCategoryImage = (
    category: string,
  ): ImageSourcePropType | null => {
    switch (category) {
      case "maintenance":
        return require("../../../assets/customer-support.png");
      case "service":
        return require("../../../assets/oil-gallon_17034637.png");
      case "inspection":
        return require("../../../assets/checklist.png");
      case "tires":
        return require("../../../assets/wheels_465128.png");
      case "tax":
        return require("../../../assets/car.png");
      case "insurance":
        return require("../../../assets/clipboard.png");
      default:
        return null;
    }
  };

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
            <View
              style={[
                styles.maintenanceAction,
                {
                  backgroundColor: dark
                    ? colors.primary + "20"
                    : "#E5E5EA",
                },
              ]}
            >
              <Text style={styles.maintenanceActionText}>›</Text>
            </View>
          </TouchableOpacity>

          <Text style={[styles.breadcrumbSeparator, { color: colors.text }]}>
            {" > "} Mantenimientos
          </Text>
        </Animated.View>
      )}

      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter("all")}>
          <Text style={filter === "all" ? styles.activeFilter : styles.filter}>
            {i18n.t("alerts.all")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("expired")}>
          <Text
            style={filter === "expired" ? styles.activeFilter : styles.filter}
          >
            {i18n.t("alerts.expired")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("upcoming")}>
          <Text
            style={filter === "upcoming" ? styles.activeFilter : styles.filter}
          >
            {i18n.t("alerts.upcoming")}
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

              if (filter === "all") return true;
              if (filter === "expired") return status === "expired";
              if (filter === "upcoming") return status === "upcoming";
              return false;
            })
            .sort((a, b) => {
              const statusA = getMaintenanceStatus(
                a.dueDate,
                a.reminderDaysBefore,
              );
              const statusB = getMaintenanceStatus(
                b.dueDate,
                b.reminderDaysBefore,
              );

              // En el tab "Todas", mandar vencidas al final
              if (filter === "all") {
                if (statusA === "expired" && statusB !== "expired") return 1;
                if (statusA !== "expired" && statusB === "expired") return -1;
              }

              // Dentro del mismo grupo, ordenar por fecha
              return (
                new Date(a.dueDate).getTime() -
                new Date(b.dueDate).getTime()
              );
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

                const categoryImage = getCategoryImage(m.category);

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
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      {categoryImage && (
                        <Image
                          source={categoryImage}
                          style={{
                            width: 36,
                            height: 36,
                            marginRight: 10,
                          }}
                          resizeMode="contain"
                        />
                      )}

                      <View style={{ flex: 1 }}>
                        <View style={styles.alertHeader}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Text
                              style={[
                                styles.alertTitle,
                                { color: colors.text },
                              ]}
                            >
                              {m.title}
                            </Text>

                            <StatusBadge
                              status={status === "ok" ? "ok" : status}
                            />
                          </View>

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
                            <View
                              style={[
                                styles.maintenanceAction,
                                {
                                  backgroundColor: dark
                                    ? colors.primary + "20"
                                    : "#E5E5EA",
                                },
                              ]}
                            >
                              <Text style={styles.maintenanceActionText}>
                                ›
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                        {(() => {
                          const today = new Date();
                          const due = new Date(m.dueDate);
                          const diffTime = due.getTime() - today.getTime();
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24),
                          );

                          const friendlyDate = due.toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          });

                          // 🔴 VENCIDA
                          if (diffDays < 0) {
                            const daysLate = Math.abs(diffDays);
                            return (
                              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <View
                                  style={{
                                    backgroundColor: "#FF3B30",
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                    borderRadius: 12,
                                  }}
                                >
                                  <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>
                                    {daysLate}
                                  </Text>
                                </View>
                                <Text style={{ color: "#FF3B30", fontWeight: "600" }}>
                                  Vencida hace {daysLate}{" "}
                                  {daysLate === 1 ? "día" : "días"}
                                </Text>
                              </View>
                            );
                          }

                          // 🟠 URGENTE (<7 días)
                          if (diffDays <= 7) {
                            return (
                              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <View
                                  style={{
                                    backgroundColor: "#FF9500",
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                    borderRadius: 12,
                                  }}
                                >
                                  <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>
                                    {diffDays}
                                  </Text>
                                </View>
                                <Text style={{ color: "#FF9500", fontWeight: "600" }}>
                                  ⏳ Vence en {diffDays}{" "}
                                  {diffDays === 1 ? "día" : "días"}
                                </Text>
                              </View>
                            );
                          }

                          // 🟡 Próxima (<30 días)
                          if (diffDays <= 30) {
                            return (
                              <Text
                                style={{
                                  color: "#FF9500",
                                  fontWeight: "600",
                                }}
                              >
                                Vence en: {diffDays}{" "}
                                {diffDays === 1 ? "día" : "días"}
                              </Text>
                            );
                          }

                          // 📅 Fecha normal
                          return (
                            <Text style={{ color: colors.text }}>
                              Vence: {friendlyDate}
                            </Text>
                          );
                        })()}
                      </View>
                    </View>
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
            {i18n.t("alerts.noAlerts")}
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

  maintenanceAction: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  maintenanceActionText: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 22,
    textAlign: "center",
    includeFontPadding: false,
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
