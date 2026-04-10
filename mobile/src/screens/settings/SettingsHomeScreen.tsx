import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useSettings } from "../../context/SettingsContext";
import { storageService } from "../../services/storageService";
import { useTheme } from "@react-navigation/native";

export default function SettingsHomeScreen() {
  const {
    globalReminderDays,
    setGlobalReminderDays,
    theme,
    setTheme,
    kmWarningThreshold,
    setKmWarningThreshold,
    kmCriticalThreshold,
    setKmCriticalThreshold,
    resetAppData,
  } = useSettings();
  const { colors } = useTheme();

  const [days, setDays] = useState(globalReminderDays.toString());
  const [warningKm, setWarningKm] = useState(kmWarningThreshold.toString());
  const [criticalKm, setCriticalKm] = useState(kmCriticalThreshold.toString());

  const handleSave = () => {
    setGlobalReminderDays(Number(days));
    setKmWarningThreshold(Number(warningKm));
    setKmCriticalThreshold(Number(criticalKm));
    Alert.alert("Guardado", "Configuración actualizada");
  };

  const handleReset = async () => {
    await resetAppData();
    Alert.alert("Reset completo", "Todos los datos fueron eliminados");
  };

  const handleExport = async () => {
    const data = await storageService.exportAllData();
    Alert.alert("Datos exportados", data.substring(0, 500));
    console.log("EXPORT DATA:", data);
  };

  const handleImport = async () => {
    Alert.prompt(
      "Importar Datos",
      "Pega aquí el JSON exportado",
      async (text) => {
        if (!text) return;

        try {
          await storageService.importAllData(text);
          Alert.alert(
            "Importación exitosa",
            "Reinicia la app para ver los cambios",
          );
        } catch (error) {
          Alert.alert("Error", "JSON inválido");
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text }}>
        Días globales para marcar como próximo:
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.card,
          },
        ]}
        placeholderTextColor={colors.text}
        value={days}
        onChangeText={setDays}
        keyboardType="numeric"
      />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Umbrales Kilometraje
      </Text>

      <Text style={{ color: colors.text }}>Advertencia (km):</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.card,
          },
        ]}
        value={warningKm}
        onChangeText={setWarningKm}
        keyboardType="numeric"
      />

      <Text style={{ color: colors.text }}>Crítico (km):</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.card,
          },
        ]}
        value={criticalKm}
        onChangeText={setCriticalKm}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Configuración</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Tema</Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme === "light" ? "#007AFF" : "#444" },
        ]}
        onPress={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Text style={styles.buttonText}>
          Cambiar a {theme === "light" ? "Oscuro" : "Claro"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Datos</Text>

      <TouchableOpacity style={styles.button} onPress={handleExport}>
        <Text style={styles.buttonText}>Exportar Datos (JSON)</Text>
      </TouchableOpacity>

      <View style={{ height: 10 }} />

      <TouchableOpacity style={styles.button} onPress={handleImport}>
        <Text style={styles.buttonText}>Importar Datos (JSON)</Text>
      </TouchableOpacity>

      <View style={{ height: 10 }} />

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.buttonText}>Resetear Aplicación</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerImage: {
    width: "100%",
    height: 120,
    marginBottom: 16,
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
  },
  resetButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
