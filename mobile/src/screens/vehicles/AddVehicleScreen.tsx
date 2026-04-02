import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useVehicles } from '../../context/VehiclesContext';
import { useNavigation } from '@react-navigation/native';

export default function AddVehicleScreen() {
  const { addVehicle } = useVehicles();
  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  const handleSave = async () => {
    if (!name || !brand || !model || !year) return;

    await addVehicle({
      name,
      brand,
      model,
      year: Number(year),
      imageUrl: undefined,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nombre" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Marca" style={styles.input} value={brand} onChangeText={setBrand} />
      <TextInput placeholder="Modelo" style={styles.input} value={model} onChangeText={setModel} />
      <TextInput
        placeholder="Año"
        style={styles.input}
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
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
