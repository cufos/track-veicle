import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useVehicles } from "../../context/VehiclesContext";
import { useNavigation, useTheme, useRoute } from "@react-navigation/native";
import { Vehicle } from "../../models/types";

type RouteParams = {
  vehicle?: Vehicle;
};

export default function AddVehicleScreen() {
  const { addVehicle, editVehicle } = useVehicles();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editingVehicle: Vehicle | undefined = route.params?.vehicle;
  const { colors, dark } = useTheme();

  const [name, setName] = useState(editingVehicle?.name || "");
  const [brand, setBrand] = useState(editingVehicle?.brand || "");
  const [model, setModel] = useState(editingVehicle?.model || "");
  const [year, setYear] = useState(
    editingVehicle ? String(editingVehicle.year) : "",
  );

  const [fuelType, setFuelType] = useState<
    "gasolina" | "diesel" | "electrico" | "hibrido"
  >(editingVehicle?.fuelType || "gasolina");

  const [vehicleType, setVehicleType] = useState<
    "carro" | "motor" | "van" | "otro"
  >(editingVehicle?.vehicleType || "carro");

  const [purchaseDate, setPurchaseDate] = useState<Date>(
    editingVehicle?.purchaseDate
      ? new Date(editingVehicle.purchaseDate)
      : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [km, setKm] = useState(
    editingVehicle?.km ? String(editingVehicle.km) : "",
  );

  const handleSave = async () => {
    if (!name || !brand || !model || !year) return;

    if (editingVehicle) {
      await editVehicle({
        ...editingVehicle,
        name,
        brand,
        model,
        year: Number(year),
        fuelType,
        vehicleType,
        purchaseDate: purchaseDate.toISOString(),
        km: km ? Number(km) : 0,
      });
    } else {
      await addVehicle({
        name,
        brand,
        model,
        year: Number(year),
        fuelType,
        vehicleType,
        purchaseDate: purchaseDate.toISOString(),
        km: km ? Number(km) : 0,
        imageUrl: undefined,
      });
    }

    navigation.goBack();
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}
        >
          Información General
        </Text>
        <TextInput
          placeholder="Nombre"
          placeholderTextColor={dark ? "#aaa" : "#666"}
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Marca"
          placeholderTextColor={dark ? "#aaa" : "#666"}
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          value={brand}
          onChangeText={setBrand}
        />

        <TextInput
          placeholder="Modelo"
          placeholderTextColor={dark ? "#aaa" : "#666"}
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          value={model}
          onChangeText={setModel}
        />

        <TextInput
          placeholder="Año"
          placeholderTextColor={dark ? "#aaa" : "#666"}
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>
            Tipo de combustible
          </Text>

          <ModalSelector
            data={[
              { key: "gasolina", label: "Gasolina" },
              { key: "diesel", label: "Diesel" },
              { key: "electrico", label: "Eléctrico" },
              { key: "hibrido", label: "Híbrido" },
            ]}
            initValue="Seleccionar combustible"
            onChange={(option) =>
              setFuelType(
                option.key as "gasolina" | "diesel" | "electrico" | "hibrido",
              )
            }
            selectStyle={{
              ...styles.selectorButton,
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            selectTextStyle={{ color: colors.text }}
            optionTextStyle={{ color: dark ? "#fff" : "#000" }}
            cancelText="Cancelar"
          >
            <View style={styles.selectorContent}>
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}
              </Text>
              <Text style={{ color: colors.text, marginLeft: 6 }}>›</Text>
            </View>
          </ModalSelector>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>
            Tipo de vehículo
          </Text>

          <ModalSelector
            data={[
              { key: "carro", label: "Carro" },
              { key: "motor", label: "Motor" },
              { key: "van", label: "Van" },
              { key: "otro", label: "Otro" },
            ]}
            initValue="Seleccionar tipo"
            onChange={(option) =>
              setVehicleType(option.key as "carro" | "motor" | "van" | "otro")
            }
            selectStyle={{
              ...styles.selectorButton,
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            selectTextStyle={{ color: colors.text }}
            optionTextStyle={{ color: dark ? "#fff" : "#000" }}
            cancelText="Cancelar"
          >
            <View style={styles.selectorContent}>
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                {vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}
              </Text>
              <Text style={{ color: colors.text, marginLeft: 6 }}>›</Text>
            </View>
          </ModalSelector>
        </View>

        <Text
          style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}
        >
          Información adicional
        </Text>

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.input,
            {
              justifyContent: "center",
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={{ color: colors.text }}>
            {purchaseDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Kilómetros (opcional)"
          placeholderTextColor={dark ? "#aaa" : "#666"}
          value={km}
          onChangeText={setKm}
          keyboardType="numeric"
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Calendar */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[styles.modalContent, { backgroundColor: colors.card }]}
              >
                <DateTimePicker
                  value={purchaseDate}
                  mode="date"
                  display="inline"
                  themeVariant={dark ? "dark" : "light"}
                  textColor={dark ? "#FFFFFF" : "#000000"}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setPurchaseDate(selectedDate);
                    }
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  selectorButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    minWidth: 130,
    backgroundColor: "#00000010",
    justifyContent: "center",
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
    width: "90%",
  },
});
