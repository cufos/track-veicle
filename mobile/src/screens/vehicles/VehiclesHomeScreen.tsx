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

const CARD_WIDTH = 220;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function VehiclesHomeScreen() {
  const { vehicles } = useVehicles();
  const { maintenances } = useMaintenances();
  const navigation = useNavigation<any>();
  const { colors, dark } = useTheme();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedVehicle = vehicles[selectedIndex];

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
        status: getMaintenanceStatus(
          m.dueDate,
          m.reminderDaysBefore,
        ),
      }))
      .filter((m) => m.status === "expired" || m.status === "upcoming")
      .sort((a, b) => {
        // 🔴 Vencidos primero
        if (a.status === "expired" && b.status !== "expired") return -1;
        if (b.status === "expired" && a.status !== "expired") return 1;

        // Luego por fecha más próxima
        return (
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
        );
      });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        horizontal={Platform.OS !== "web"}
        pagingEnabled={Platform.OS !== "web"}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingVertical: 10 }}
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
              width: Platform.OS === "web" ? "100%" : SCREEN_WIDTH,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  width: Platform.OS === "web" ? "100%" : CARD_WIDTH,
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
              <Text style={{ color: colors.text }}>
                {item.brand} {item.model} - {item.year}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {selectedVehicle && (
        <>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Próximos mantenimientos
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

          <View style={[styles.section, { backgroundColor: colors.card }]}>
            {!vehicleMaintenances ||
              (vehicleMaintenances.length === 0 && (
                <Text style={{ color: colors.text }}>
                  No hay mantenimientos próximos
                </Text>
              ))}

            {vehicleMaintenances &&
              vehicleMaintenances.map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.maintenancePreviewCard,
                    { borderColor: colors.border },
                  ]}
                >
                  <Text style={{ color: colors.text, fontWeight: "600" }}>
                    {m.title}
                  </Text>
                  <Text style={{ color: colors.text, fontSize: 12 }}>
                    Vence: {m.dueDate}
                  </Text>
                </View>
              ))}
          </View>
        </>
      )}

      {vehicles.length < 3 && vehicles.length > 0 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AddVehicle")}
        >
          <Text style={styles.buttonText}>+ Agregar Vehículo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
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
    marginTop: 20,
    marginBottom: 8,
  },
  section: {
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  maintenancePreviewCard: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
