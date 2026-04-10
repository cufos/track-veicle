import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMaintenances } from "../../context/MaintenancesContext";
import {
  RouteProp,
  useNavigation,
  useRoute,
  useTheme,
} from "@react-navigation/native";
import { Maintenance } from "../../models/types";

type ParamList = {
  AddMaintenance: { vehicleId: string; maintenance?: Maintenance };
};

export default function AddMaintenanceScreen() {
  const { addMaintenance, editMaintenance, deleteMaintenance } =
    useMaintenances();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ParamList, "AddMaintenance">>();
  const { vehicleId, maintenance } = route.params;
  const { colors, dark } = useTheme();

  const editing = !!maintenance;

  const [title, setTitle] = useState(maintenance?.title || "");
  const [dueDate, setDueDate] = useState<Date>(
    maintenance ? new Date(maintenance.dueDate) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(
    maintenance ? String(maintenance.reminderDaysBefore) : "7",
  );

  const handleSave = async () => {
    const days = Math.max(1, Number(reminderDaysBefore));

    if (!title) return;

    if (editing && maintenance) {
      await editMaintenance({
        ...maintenance,
        title,
        dueDate: dueDate.toISOString().split("T")[0],
        reminderDaysBefore: days,
      });
    } else {
      await addMaintenance({
        vehicleId,
        title,
        dueDate: dueDate.toISOString().split("T")[0],
        reminderDaysBefore: days,
        type: "date",
        notes: "",
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
        <TextInput
          placeholder="Título"
          placeholderTextColor={dark ? "#aaa" : "#666"}
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          value={title}
          onChangeText={setTitle}
        />

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
            {dueDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Días antes para alerta"
          placeholderTextColor={dark ? "#aaa" : "#666"}
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          value={reminderDaysBefore}
          onChangeText={(text) => {
            const value = Number(text);
            if (value < 1) {
              setReminderDaysBefore("1");
            } else {
              setReminderDaysBefore(text);
            }
          }}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {editing ? "Actualizar Mantenimiento" : "Guardar Mantenimiento"}
          </Text>
        </TouchableOpacity>

        {editing && maintenance && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF3B30" }]}
            onPress={() => {
              Alert.alert(
                "Eliminar mantenimiento",
                "¿Estás seguro que quieres eliminar este mantenimiento?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                      await deleteMaintenance(maintenance.id);
                      navigation.goBack();
                    },
                  },
                ],
              );
            }}
          >
            <Text style={styles.buttonText}>Eliminar Mantenimiento</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onValueChange={(event, selectedDate) => {
            setShowDatePicker(false);

            if (selectedDate) {
              setDueDate(selectedDate);
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
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
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
