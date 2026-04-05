import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useVehicles } from "../../context/VehiclesContext";
import { useNavigation, useTheme } from "@react-navigation/native";

export default function VehiclesHomeScreen() {
  const { vehicles } = useVehicles();
  const navigation = useNavigation<any>();
  const { colors, dark } = useTheme();

  return (
    <View style={styles.container}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
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
          <TouchableOpacity
            style={styles.card}
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
              item.imageUrl !== "local-motor" && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            <Text style={[styles.title, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={{ color: colors.text }}>
              {item.brand} {item.model} - {item.year}
            </Text>
          </TouchableOpacity>
        )}
      />

      {vehicles.length < 3 && (
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
    padding: 16,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
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
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
