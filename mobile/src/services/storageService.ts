import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle, Maintenance } from '../models/types';

const VEHICLES_KEY = 'VEHICLES';
const MAINTENANCES_KEY = 'MAINTENANCES';

export const storageService = {
  async getVehicles(): Promise<Vehicle[]> {
    const data = await AsyncStorage.getItem(VEHICLES_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveVehicles(vehicles: Vehicle[]) {
    await AsyncStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
  },

  async getMaintenances(): Promise<Maintenance[]> {
    const data = await AsyncStorage.getItem(MAINTENANCES_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveMaintenances(maintenances: Maintenance[]) {
    await AsyncStorage.setItem(MAINTENANCES_KEY, JSON.stringify(maintenances));
  },

  async clearAll() {
    // Completely wipe AsyncStorage to ensure full reset
    await AsyncStorage.clear();
  },

  async exportAllData() {
    const vehicles = await AsyncStorage.getItem(VEHICLES_KEY);
    const maintenances = await AsyncStorage.getItem(MAINTENANCES_KEY);

    return JSON.stringify(
      {
        vehicles: vehicles ? JSON.parse(vehicles) : [],
        maintenances: maintenances ? JSON.parse(maintenances) : [],
      },
      null,
      2
    );
  },

  async importAllData(jsonString: string) {
    const parsed = JSON.parse(jsonString);

    if (parsed.vehicles) {
      await AsyncStorage.setItem(
        VEHICLES_KEY,
        JSON.stringify(parsed.vehicles)
      );
    }

    if (parsed.maintenances) {
      await AsyncStorage.setItem(
        MAINTENANCES_KEY,
        JSON.stringify(parsed.maintenances)
      );
    }
  },
};
