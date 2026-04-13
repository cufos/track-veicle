import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import { useVehicles } from "../../context/VehiclesContext";
import { useMaintenances } from "../../context/MaintenancesContext";
import { getMaintenanceStatus } from "../../utils/dateUtils";
import { useNavigation, useTheme } from "@react-navigation/native";
import StatusBadge from "../../components/StatusBadge";
import DueDateIndicator from "../../components/DueDateIndicator";
import i18n from "../../i18n";

const CARD_WIDTH = 220;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function VehiclesHomeScreen() {
  const { vehicles } = useVehicles();
  const { maintenances } = useMaintenances();
  const navigation = useNavigation<any>();
  const { colors, dark } = useTheme();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedVehicle = vehicles[selectedIndex];

  React.useEffect(() => {
    if (selectedIndex >= vehicles.length && vehicles.length > 0) {
      setSelectedIndex(vehicles.length - 1);
    }
  }, [vehicles, selectedIndex]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setSelectedIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const vehicleMaintenances =
    selectedVehicle &&
    maintenances
      .filter((m) => m.vehicleId === selectedVehicle.id)
      .map((m) => ({
        ...m,
        status: getMaintenanceStatus(m.dueDate, m.reminderDaysBefore),
      }))
      .filter((m) => m.status === "upcoming")
      .sort((a, b) => {
        // 🔴 Vencidos primero
        if (a.status === "expired" && b.status !== "expired") return -1;
        if (b.status === "expired" && a.status !== "expired") return 1;

        // Luego por fecha más próxima
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        horizontal={vehicles.length > 0}
        pagingEnabled={vehicles.length > 0}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingVertical: 0 }}
        style={{ flexGrow: 0 }}
        snapToInterval={vehicles.length > 0 ? SCREEN_WIDTH : undefined}
        decelerationRate={vehicles.length > 0 ? "fast" : "normal"}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../../assets/car-wash.png")}
              style={[
                styles.emptyImage,
                { tintColor: dark ? "#FFFFFF" : "#000000" },
              ]}
              resizeMode="contain"
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Bienvenido a tu garaje personal
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.text }]}>
              Agrega tu primer vehículo para que no te olvides ninguna
              manutención.
            </Text>

            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={() => navigation.navigate("AddVehicle")}
            >
              <Text style={styles.buttonText}>+ Agregar Vehículo</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              width: SCREEN_WIDTH,
            }}
          >
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  width: SCREEN_WIDTH - 32,
                  marginHorizontal: 16,
                },
              ]}
              onPress={() =>
                navigation.navigate("VehicleDetail", { vehicle: item })
              }
            >
              {item.imageUrl === "local-van" && (
                <Image
                  source={require("../../../assets/van.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}

              {item.imageUrl === "local-motor" && (
                <Image
                  source={require("../../../assets/motor.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}

              {item.imageUrl === "local-default" && (
                <Image
                  source={require("../../../assets/carro_defecto.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}

              {item.imageUrl &&
                item.imageUrl !== "local-van" &&
                item.imageUrl !== "local-motor" &&
                item.imageUrl !== "local-default" && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                )}

              <Text style={[styles.title, { color: colors.text }]}>
                {item.name}
              </Text>

              <View style={styles.vehicleInfoRow}>
                <Text style={{ color: colors.text }}>
                  {item.brand} {item.model} - {item.year}
                </Text>

                <View style={styles.kmContainer}>
                  {(() => {
                    const kmValue = item.km ?? 0;
                    const formattedKm = kmValue.toLocaleString("es-ES");
                    
                    let kmColor = colors.text;
                    if (kmValue >= 200000) kmColor = "#FF3B30"; // rojo
                    else if (kmValue >= 100000) kmColor = "#FF9500"; // naranja

                    return (
                      <>
                        <Image
                          source={require("../../../assets/speedometer_2297516.png")}
                          style={[styles.kmIcon, { tintColor: kmColor }]}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            color: kmColor,
                            marginLeft: 4,
                            fontWeight: "600",
                          }}
                        >
                          {formattedKm} km
                        </Text>
                      </>
                    );
                  })()}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Indicador estilo iPhone (dots) */}
      {vehicles.length > 1 && (
        <View style={styles.dotsContainer}>
          {vehicles.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === selectedIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}

      {selectedVehicle && (
        <>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {i18n.t("alerts.upcoming")}
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Alertas", {
                  screen: "AlertsHome",
                  params: { vehicleId: selectedVehicle.id },
                })
              }
            >
              <Text style={{ color: "#007AFF", fontWeight: "600" }}>
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>

          {!vehicleMaintenances ||
            (vehicleMaintenances.length === 0 && (
              <View
                style={[
                  styles.maintenanceBox,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={{ color: colors.text }}>
                  {i18n.t("alerts.noAlerts")}
                </Text>
              </View>
            ))}

          {vehicleMaintenances?.map((m) => {
              const getCategoryImage = (category: string) => {
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

              const categoryImage = getCategoryImage(m.category);

              return (
                <View
                  key={m.id}
                  style={[
                    styles.maintenanceBox,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    {categoryImage && (
                      <Image
                        source={categoryImage}
                        style={{ width: 28, height: 28 }}
                        resizeMode="contain"
                      />
                    )}

                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.text,
                            fontWeight: "600",
                          }}
                        >
                          {m.title}
                        </Text>

                        <StatusBadge status={m.status} />
                      </View>

                      <DueDateIndicator
                        dueDate={m.dueDate}
                        textColor={colors.text}
                        fontSize={12}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
        </>
      )}

      {vehicles.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddVehicle")}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 16, paddingBottom: 100 },
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: "bold" },

  vehicleInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  kmContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  kmIcon: {
    width: 18,
    height: 18,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  maintenanceBox: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#007AFF",
    width: 10,
    height: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
  },
  buttonText: { color: "white", fontWeight: "bold" },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: {
    color: "white",
    fontSize: 32,
    fontWeight: "600",
    marginTop: -2,
  },
});
