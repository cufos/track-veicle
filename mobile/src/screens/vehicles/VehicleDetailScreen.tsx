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
import { useSettings } from "../../context/SettingsContext";
import StatusBadge from "../../components/StatusBadge";

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

  // Ordenar todos los mantenimientos por fecha más cercana a vencer
  const sortedMaintenances = [...maintenances].sort(
    (a, b) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );

  return (
    <ScrollView style={styles.container}>
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

      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
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
        <Text style={styles.addButtonText}>+ Agregar Mantenimiento</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={async () => {
          if (Platform.OS === "web") {
            const confirmed = window.confirm(
              "¿Estás seguro que quieres eliminar este vehículo? Esta acción no se puede deshacer.",
            );

            if (confirmed) {
              await deleteVehicle(currentVehicle.id);
              navigation.goBack();
            }
          } else {
            Alert.alert(
              "Eliminar vehículo",
              "¿Estás seguro que quieres eliminar este vehículo? Esta acción no se puede deshacer.",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Eliminar",
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
        <Text style={styles.deleteButtonText}>Eliminar Vehículo</Text>
      </TouchableOpacity>

      <View>
        <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>
          Todos
        </Text>

      {sortedMaintenances.map((m) => {
        const status = getMaintenanceStatus(m.dueDate, globalReminderDays);

        const statusColor =
          status === "expired"
            ? "red"
            : status === "upcoming"
              ? "orange"
              : "green";

        return (
          <View
            key={m.id}
            style={[
              styles.maintenanceCard,
              { backgroundColor: colors.card },
            ]}
          >
            <View style={styles.maintenanceHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={styles.maintenanceTitle}>{m.title}</Text>

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

        {sortedMaintenances.length === 0 && (
          <Text style={{ color: "#666" }}>
            No hay mantenimientos registrados
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
