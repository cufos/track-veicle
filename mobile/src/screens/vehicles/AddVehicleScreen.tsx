import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useVehicles } from "../../context/VehiclesContext";
import { useNavigation, useTheme, useRoute } from "@react-navigation/native";
import { Vehicle } from "../../models/types";
import i18n from "../../i18n";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (isSubmitting) return;
    if (!name || !brand || !model || !year) return;

    try {
      setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
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
          {i18n.t("vehicle.generalInfo")}
        </Text>
        <TextInput
          placeholder={i18n.t("vehicle.name")}
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
          placeholder={i18n.t("vehicle.brand")}
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
          placeholder={i18n.t("vehicle.model")}
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
          placeholder={i18n.t("vehicle.year")}
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
            {i18n.t("vehicle.fuelType")}
          </Text>

          <ModalSelector
            data={[
              { key: "gasolina", label: i18n.t("fuelTypes.gasolina") },
              { key: "diesel", label: i18n.t("fuelTypes.diesel") },
              { key: "electrico", label: i18n.t("fuelTypes.electrico") },
              { key: "hibrido", label: i18n.t("fuelTypes.hibrido") },
            ]}
            initValue={i18n.t("vehicle.selectFuel")}
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
            cancelText={i18n.t("common.cancel")}
          >
            <View style={styles.selectorContent}>
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                {i18n.t(`fuelTypes.${fuelType}`)}
              </Text>
              <Text style={{ color: colors.text, marginLeft: 6 }}>›</Text>
            </View>
          </ModalSelector>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>
            {i18n.t("vehicle.vehicleType")}
          </Text>

          <ModalSelector
            data={[
              { key: "carro", label: i18n.t("vehicleTypes.carro") },
              { key: "motor", label: i18n.t("vehicleTypes.motor") },
              { key: "van", label: i18n.t("vehicleTypes.van") },
              { key: "otro", label: i18n.t("vehicleTypes.otro") },
            ]}
            initValue={i18n.t("vehicle.selectType")}
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
            cancelText={i18n.t("common.cancel")}
          >
            <View style={styles.selectorContent}>
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                {i18n.t(`vehicleTypes.${vehicleType}`)}
              </Text>
              <Text style={{ color: colors.text, marginLeft: 6 }}>›</Text>
            </View>
          </ModalSelector>
        </View>

        <Text
          style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}
        >
          {i18n.t("vehicle.additionalInfo")}
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
            {purchaseDate.toLocaleDateString(i18n.locale, {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder={i18n.t("vehicle.kilometersOptional")}
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

        <TouchableOpacity
          style={[
            styles.button,
            { opacity: isSubmitting ? 0.7 : 1 },
          ]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {i18n.t("vehicle.save")}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={purchaseDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onValueChange={(event, selectedDate) => {
            setShowDatePicker(false);

            if (selectedDate) {
              setPurchaseDate(selectedDate);
            }
          }}
        />
      )}
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
  fullScreenModal: {
    flex: 1,
    justifyContent: "flex-start",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  cancelButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "400",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  doneButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
