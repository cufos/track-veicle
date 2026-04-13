import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
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
import { getDueDateStatus } from "../../utils/dueDateUtils";
import { useSettings } from "../../context/SettingsContext";
import StatusBadge from "../../components/StatusBadge";
import DueDateIndicator from "../../components/DueDateIndicator";
import i18n from "../../i18n";
import { ImageSourcePropType } from "react-native";

type ParamList = {
  VehicleDetail: { vehicle: Vehicle };
};

export default function VehicleDetailScreen() {
  const route = useRoute<RouteProp<ParamList, "VehicleDetail">>();
  const navigation = useNavigation<any>();
  const { vehicle } = route.params;
  const { vehicles, deleteVehicle } = useVehicles();
  const { getMaintenancesByVehicle } = useMaintenances();
  const {
    globalReminderDays,
    kmWarningThreshold,
    kmCriticalThreshold,
  } = useSettings();
  const { colors, dark } = useTheme();

  const currentVehicle =
    vehicles.find((v) => v.id === vehicle.id) || vehicle;

  const maintenances = getMaintenancesByVehicle(currentVehicle.id).sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return dateA - dateB;
  });

  // Separar mantenimientos en activos y vencidos
  const activeMaintenances = maintenances
    .filter(
      (m) =>
        getMaintenanceStatus(m.dueDate, globalReminderDays) !== "expired",
    )
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime(),
    );

  const expiredMaintenances = maintenances
    .filter(
      (m) =>
        getMaintenanceStatus(m.dueDate, globalReminderDays) === "expired",
    )
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime(),
    );

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {currentVehicle.imageUrl === "local-van" && (
        <Image
          source={require("../../../assets/van.png")}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      {currentVehicle.imageUrl === "local-motor" && (
        <Image
          source={require("../../../assets/motor.png")}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      {currentVehicle.imageUrl === "local-default" && (
        <Image
          source={require("../../../assets/carro_defecto.png")}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      {currentVehicle.imageUrl &&
        currentVehicle.imageUrl !== "local-van" &&
        currentVehicle.imageUrl !== "local-motor" &&
        currentVehicle.imageUrl !== "local-default" && (
          <Image
            source={{ uri: currentVehicle.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Text style={styles.name}>{currentVehicle.name}</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("AddVehicle", { vehicle })}
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
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <View>
            <Text>
              {currentVehicle.brand} {currentVehicle.model}
            </Text>
            <Text>Año: {currentVehicle.year}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../../assets/speedometer_2297516.png")}
              style={{
                width: 20,
                height: 20,
                tintColor:
                  (currentVehicle.km ?? 0) >= kmCriticalThreshold
                    ? "#FF3B30"
                    : (currentVehicle.km ?? 0) >= kmWarningThreshold
                    ? "#FF9500"
                    : colors.text,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                marginLeft: 6,
                fontWeight: "700",
                fontSize: 16,
                color:
                  (currentVehicle.km ?? 0) >= kmCriticalThreshold
                    ? "#FF3B30"
                    : (currentVehicle.km ?? 0) >= kmWarningThreshold
                    ? "#FF9500"
                    : colors.text,
              }}
            >
              {(currentVehicle.km ?? 0).toLocaleString("es-ES")} km
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("AddMaintenance", { vehicleId: currentVehicle.id })
        }
      >
        <Text style={styles.addButtonText}>
          + {i18n.t("alerts.upcoming")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={async () => {
          if (Platform.OS === "web") {
            const confirmed = window.confirm(
              i18n.t("common.delete"),
            );

            if (confirmed) {
              await deleteVehicle(currentVehicle.id);
              navigation.goBack();
            }
          } else {
            Alert.alert(
              i18n.t("common.delete"),
              i18n.t("common.delete"),
              [
                { text: i18n.t("common.cancel"), style: "cancel" },
                {
                  text: i18n.t("common.delete"),
                  style: "destructive",
                  onPress: async () => {
                    await deleteVehicle(currentVehicle.id);
                    navigation.goBack();
                  },
                },
              ],
            );
          }
        }}
      >
        <Text style={styles.deleteButtonText}>
          {i18n.t("common.delete")}
        </Text>
      </TouchableOpacity>

      <View>
        <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>
          {i18n.t("alerts.all")}
        </Text>

      {activeMaintenances.map((m) => {
        const status = getMaintenanceStatus(m.dueDate, globalReminderDays);

        const statusColor =
          status === "expired"
            ? "red"
            : status === "upcoming"
              ? "orange"
              : "green";

        const categoryImage = getCategoryImage(m.category);

        return (
          <View
            key={m.id}
            style={[
              styles.maintenanceCard,
              { backgroundColor: colors.card },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {categoryImage && (
                <Image
                  source={categoryImage}
                  style={{ width: 40, height: 40, marginRight: 12 }}
                  resizeMode="contain"
                />
              )}

              <View style={{ flex: 1 }}>
                <View style={styles.maintenanceHeader}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={styles.maintenanceTitle}>
                      {m.title}
                    </Text>

                    <StatusBadge status={status === "ok" ? "ok" : status} />
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("AddMaintenance", {
                        vehicleId: currentVehicle.id,
                        maintenance: m,
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
                </View>

                {(() => {
                  const dueInfo = getDueDateStatus(m.dueDate);

                  if (dueInfo.type === "expired") {
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
                            {dueInfo.days}
                          </Text>
                        </View>
                        <Text style={{ color: "#FF3B30", fontSize: 12, fontWeight: "600" }}>
                          Vencida hace {dueInfo.days}{" "}
                          {dueInfo.days === 1 ? "día" : "días"}
                        </Text>
                      </View>
                    );
                  }

                  if (dueInfo.type === "urgent") {
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
                            {dueInfo.days}
                          </Text>
                        </View>
                        <Text style={{ color: "#FF9500", fontSize: 12, fontWeight: "600" }}>
                          ⏳ Vence en {dueInfo.days}{" "}
                          {dueInfo.days === 1 ? "día" : "días"}
                        </Text>
                      </View>
                    );
                  }

                  if (dueInfo.type === "upcoming") {
                    return (
                      <Text style={{ color: "#FF9500", fontSize: 12, fontWeight: "600" }}>
                        Vence en: {dueInfo.days}{" "}
                        {dueInfo.days === 1 ? "día" : "días"}
                      </Text>
                    );
                  }

                  return (
                    <Text style={{ fontSize: 12 }}>
                      Vence: {dueInfo.friendlyDate}
                    </Text>
                  );
                })()}
              </View>
            </View>
          </View>
        );
      })}

      {expiredMaintenances.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>
            {i18n.t("alerts.expired")}
          </Text>

          {expiredMaintenances.map((m) => {
            const status = getMaintenanceStatus(
              m.dueDate,
              globalReminderDays,
            );
            const categoryImage = getCategoryImage(m.category);

            return (
              <View
                key={m.id}
                style={[
                  styles.maintenanceCard,
                  { backgroundColor: colors.card },
                ]}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  {categoryImage && (
                    <Image
                      source={categoryImage}
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 12,
                      }}
                      resizeMode="contain"
                    />
                  )}

                  <View style={{ flex: 1 }}>
                    <View style={styles.maintenanceHeader}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text style={styles.maintenanceTitle}>
                          {m.title}
                        </Text>

                        <StatusBadge
                          status={status === "ok" ? "ok" : status}
                        />
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("AddMaintenance", {
                            vehicleId: currentVehicle.id,
                            maintenance: m,
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
                      const dueInfo = getDueDateStatus(m.dueDate);

                      if (dueInfo.type === "expired") {
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
                                {dueInfo.days}
                              </Text>
                            </View>
                            <Text style={{ color: "#FF3B30", fontSize: 12, fontWeight: "600" }}>
                              Vencida hace {dueInfo.days}{" "}
                              {dueInfo.days === 1 ? "día" : "días"}
                            </Text>
                          </View>
                        );
                      }

                      if (dueInfo.type === "urgent") {
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
                                {dueInfo.days}
                              </Text>
                            </View>
                            <Text style={{ color: "#FF9500", fontSize: 12, fontWeight: "600" }}>
                              ⏳ Vence en {dueInfo.days}{" "}
                              {dueInfo.days === 1 ? "día" : "días"}
                            </Text>
                          </View>
                        );
                      }

                      if (dueInfo.type === "upcoming") {
                        return (
                          <Text style={{ color: "#FF9500", fontSize: 12, fontWeight: "600" }}>
                            Vence en: {dueInfo.days}{" "}
                            {dueInfo.days === 1 ? "día" : "días"}
                          </Text>
                        );
                      }

                      return (
                        <Text style={{ fontSize: 12 }}>
                          Vence: {dueInfo.friendlyDate}
                        </Text>
                      );
                    })()}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {activeMaintenances.length === 0 &&
        expiredMaintenances.length === 0 && (
          <Text style={{ color: "#666" }}>
            {i18n.t("alerts.noAlerts")}
          </Text>
        )}
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
    padding: 18,
    backgroundColor: "#F6F6F6",
    borderRadius: 28,
    marginBottom: 20,
    overflow: "hidden",

    // Shadow iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,

    // Shadow Android
    elevation: 6,
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
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  inlineEditText: {
    fontSize: 16,
  },

  breadcrumbText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 20,
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
    marginHorizontal: 4,
    marginBottom: 16,
    padding: 20,
    borderRadius: 28,
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
