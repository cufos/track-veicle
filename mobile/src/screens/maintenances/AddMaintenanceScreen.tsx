import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useMaintenances } from '../../context/MaintenancesContext';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type ParamList = {
  AddMaintenance: { vehicleId: string };
};

export default function AddMaintenanceScreen() {
  const { addMaintenance } = useMaintenances();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ParamList, 'AddMaintenance'>>();
  const { vehicleId } = route.params;

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminderDaysBefore, setReminderDaysBefore] = useState('7');

  const handleSave = async () => {
    if (!title || !dueDate) return;

    await addMaintenance({
      vehicleId,
      title,
      dueDate,
      reminderDaysBefore: Number(reminderDaysBefore),
      type: 'date',
      notes: '',
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Fecha vencimiento (YYYY-MM-DD)"
        style={styles.input}
        value={dueDate}
        onChangeText={setDueDate}
      />
      <TextInput
        placeholder="Días antes para alerta"
        style={styles.input}
        value={reminderDaysBefore}
        onChangeText={setReminderDaysBefore}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Mantenimiento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
