import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { useVehicles } from "../../context/VehiclesContext";
import { useMaintenances } from "../../context/MaintenancesContext";
import { getMaintenanceStatus } from "../../utils/dateUtils";
import { useNavigation, useTheme } from "@react-navigation/native";

export default function VehiclesHomeScreen() {
  const { vehicles } = useVehicles();
  const { maintenances } = useMaintenances();
  const navigation = useNavigation<any>();
  const { colors, dark } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const sectionHeight = useRef(new Animated.Value(0)).current;
  const sectionOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (vehicles.length > 0) {
      Animated.parallel([
        Animated.timing(sectionHeight, {
          toValue: collapsed ? 0 : 160,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(sectionOpacity, {
          toValue: collapsed ? 0 : 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [collapsed, vehicles.length]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
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
        renderItem={({ item }) => {
          const vehicleMaintenances = maintenances
            .filter((m) => m.vehicleId === item.id)
            .filter((m) => {
              const status = getMaintenanceStatus(
                m.dueDate,
                m.reminderDaysBefore,
              );
              return status === "expired" || status === "upcoming";
            })
            .slice(0, 2);

          return (
            <View style={{ marginRight: 12, width: 220 }}>
              <TouchableOpacity
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
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

              {vehicleMaintenances.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: "700",
                        fontSize: 13,
                      }}
                    >
                      Próximos mantenimientos
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Alertas", {
                          screen: "AlertsHome",
                          params: { vehicleId: item.id },
                        })
                      }
                    >
                      <Text style={{ color: "#007AFF", fontWeight: "600" }}>
                        Ver todos
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {vehicleMaintenances.map((m) => (
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
              )}
            </View>
          );
        }}
      />

      {/* La sección global se elimina porque ahora se mostrará por vehículo */}

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
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    width: 220,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: "bold" },

  headerImage: {
    width: "100%",
    height: 120,
    marginBottom: 10,
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
  section: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  seeAllText: {
    color: "#007AFF",
    fontWeight: "600",
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
