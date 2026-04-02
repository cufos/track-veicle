import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useVehicles } from '../../context/VehiclesContext';
import { useNavigation } from '@react-navigation/native';

export default function VehiclesHomeScreen() {
  const { vehicles } = useVehicles();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No hay vehículos registrados</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('VehicleDetail', { vehicle: item })}
          >
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            )}
            <Text style={styles.title}>{item.name}</Text>
            <Text>
              {item.brand} {item.model} - {item.year}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddVehicle')}
      >
        <Text style={styles.buttonText}>+ Agregar Vehículo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
