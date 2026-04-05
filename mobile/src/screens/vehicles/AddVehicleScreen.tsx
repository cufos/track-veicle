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
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useVehicles } from "../../context/VehiclesContext";
import { useNavigation, useTheme } from "@react-navigation/native";

export default function AddVehicleScreen() {
  const { addVehicle } = useVehicles();
  const navigation = useNavigation<any>();
  const { colors, dark } = useTheme();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const [fuelType, setFuelType] = useState<
    "gasolina" | "diesel" | "electrico" | "hibrido"
  >("gasolina");

  const [vehicleType, setVehicleType] = useState<
    "carro" | "motor" | "van" | "otro"
  >("carro");

  const [purchaseDate, setPurchaseDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [km, setKm] = useState("0");

  const handleSave = async () => {
    if (!name || !brand || !model || !year) return;

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

        <Text style={[styles.label, { color: colors.text }]}>
          Tipo de combustible
        </Text>

        <View
          style={[
            styles.selectContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Picker
            selectedValue={fuelType}
            onValueChange={(itemValue) => setFuelType(itemValue)}
            dropdownIconColor={colors.text}
            style={{ color: colors.text }}
          >
            <Picker.Item label="Gasolina" value="gasolina" />
            <Picker.Item label="Diesel" value="diesel" />
            <Picker.Item label="Eléctrico" value="electrico" />
            <Picker.Item label="Híbrido" value="hibrido" />
          </Picker>
        </View>

        <Text style={[styles.label, { color: colors.text }]}>
          Tipo de vehículo
        </Text>

        <View
          style={[
            styles.selectContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Picker
            selectedValue={vehicleType}
            onValueChange={(itemValue) => setVehicleType(itemValue)}
            dropdownIconColor={colors.text}
            style={{ color: colors.text }}
          >
            <Picker.Item label="Carro" value="carro" />
            <Picker.Item label="Motor" value="motor" />
            <Picker.Item label="Van" value="van" />
            <Picker.Item label="Otro" value="otro" />
          </Picker>
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
          placeholder="Kilómetros"
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
  selectContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 4,
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
