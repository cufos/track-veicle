import React, { createContext, useContext, useEffect, useState } from 'react';
import { Vehicle } from '../models/types';
import { storageService } from '../services/storageService';
import { vehicleApiService } from '../services/vehicleApiService';
import { v4 as uuidv4 } from 'uuid';

interface VehiclesContextProps {
  vehicles: Vehicle[];
  loadVehicles: () => Promise<void>;
  addVehicle: (data: Omit<Vehicle, 'id' | 'createdAt'>) => Promise<void>;
}

const VehiclesContext = createContext<VehiclesContextProps | undefined>(undefined);

export const VehiclesProvider = ({ children }: { children: React.ReactNode }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const loadVehicles = async () => {
    const data = await storageService.getVehicles();
    setVehicles(data);
  };

  const addVehicle = async (data: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const imageUrl = await vehicleApiService.getVehicleImage(data.brand, data.model);

    const newVehicle: Vehicle = {
      ...data,
      imageUrl,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...vehicles, newVehicle];
    setVehicles(updated);
    await storageService.saveVehicles(updated);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  return (
    <VehiclesContext.Provider value={{ vehicles, loadVehicles, addVehicle }}>
      {children}
    </VehiclesContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error('useVehicles must be used within VehiclesProvider');
  }
  return context;
};
