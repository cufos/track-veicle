import React, { createContext, useContext, useEffect, useState } from "react";
import { Vehicle } from "../models/types";
import { storageService } from "../services/storageService";
import { vehicleApiService } from "../services/vehicleApiService";

interface VehiclesContextProps {
  vehicles: Vehicle[];
  loadVehicles: () => Promise<void>;
  addVehicle: (data: Omit<Vehicle, "id" | "createdAt">) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
}

const VehiclesContext = createContext<VehiclesContextProps | undefined>(
  undefined,
);

export const VehiclesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const loadVehicles = async () => {
    const data = await storageService.getVehicles();
    setVehicles(data);
  };

  const addVehicle = async (data: Omit<Vehicle, "id" | "createdAt">) => {
    // ✅ Limitar máximo 3 vehículos
    if (vehicles.length >= 3) {
      console.warn("Máximo de 3 vehículos alcanzado");
      return;
    }

    let imageUrl: string | undefined;

    // Si es van o motor no llamamos a la API
    if (data.vehicleType === "van") {
      imageUrl = "local-van";
    } else if (data.vehicleType === "motor") {
      imageUrl = "local-motor";
    } else {
      const images = await vehicleApiService.getVehicleImages(
        data.brand,
        data.model,
        data.year,
      );

      if (images.length > 0) {
        imageUrl = images[0]; // primera imagen
      } else {
        imageUrl = vehicleApiService.getFallbackImage();
      }
    }

    const newVehicle: Vehicle = {
      ...data,
      imageUrl,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...vehicles, newVehicle];
    setVehicles(updated);
    await storageService.saveVehicles(updated);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const deleteVehicle = async (id: string) => {
    const updated = vehicles.filter((v) => v.id !== id);
    setVehicles(updated);
    await storageService.saveVehicles(updated);
  };

  return (
    <VehiclesContext.Provider
      value={{ vehicles, loadVehicles, addVehicle, deleteVehicle }}
    >
      {children}
    </VehiclesContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error("useVehicles must be used within VehiclesProvider");
  }
  return context;
};
