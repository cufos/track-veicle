import React, { createContext, useContext, useEffect, useState } from "react";
import { Maintenance } from "../models/types";
import { storageService } from "../services/storageService";
import { notificationService } from "../services/notificationService";
import { useSettings } from "./SettingsContext";

interface MaintenancesContextProps {
  maintenances: Maintenance[];
  loadMaintenances: () => Promise<void>;
  addMaintenance: (
    data: Omit<Maintenance, "id" | "createdAt">,
  ) => Promise<void>;
  editMaintenance: (updated: Maintenance) => Promise<void>;
  deleteMaintenance: (id: string) => Promise<void>;
  getMaintenancesByVehicle: (vehicleId: string) => Maintenance[];
}

const MaintenancesContext = createContext<MaintenancesContextProps | undefined>(
  undefined,
);

export const MaintenancesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const { globalReminderDays } = useSettings();

  const loadMaintenances = async () => {
    const data = await storageService.getMaintenances();

    // ✅ Migración automática de mantenimientos antiguos
    const migrated = data.map((m: any) => {
      if (m.category) return m; // ya está migrado

      if (typeof m.title === "string" && m.title.includes(" - ")) {
        const [rawCategory, ...rest] = m.title.split(" - ");
        const cleanTitle = rest.join(" - ");

        const categoryMap: Record<string, any> = {
          "Mantenimiento": "maintenance",
          "Servicio": "service",
          "Inspección": "inspection",
          "Neumáticos": "tires",
          "Impuesto de circulación": "tax",
          "Aseguración": "insurance",
        };

        const mappedCategory = categoryMap[rawCategory];

        if (mappedCategory) {
          return {
            ...m,
            category: mappedCategory,
            title: cleanTitle,
          };
        }
      }

      return m;
    });

    setMaintenances(migrated);

    // Guardar si hubo cambios estructurales
    if (JSON.stringify(data) !== JSON.stringify(migrated)) {
      await storageService.saveMaintenances(migrated);
    }
  };

  const addMaintenance = async (
    data: Omit<Maintenance, "id" | "createdAt">,
  ) => {
    const newMaintenance: Maintenance = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...maintenances, newMaintenance];
    setMaintenances(updated);
    await storageService.saveMaintenances(updated);
  };

  const editMaintenance = async (updatedMaintenance: Maintenance) => {
    const updated = maintenances.map((m) =>
      m.id === updatedMaintenance.id ? updatedMaintenance : m,
    );
    setMaintenances(updated);
    await storageService.saveMaintenances(updated);
  };

  const deleteMaintenance = async (id: string) => {
    const updated = maintenances.filter((m) => m.id !== id);
    setMaintenances(updated);
    await storageService.saveMaintenances(updated);
  };

  const getMaintenancesByVehicle = (vehicleId: string) => {
    return maintenances.filter((m) => m.vehicleId === vehicleId);
  };

  useEffect(() => {
    loadMaintenances();
  }, []);

  useEffect(() => {
    const runNotificationCheck = async () => {
      await notificationService.checkAndNotify(
        maintenances,
        globalReminderDays,
      );
    };

    runNotificationCheck();
  }, [maintenances, globalReminderDays]);

  return (
    <MaintenancesContext.Provider
      value={{
        maintenances,
        loadMaintenances,
        addMaintenance,
        editMaintenance,
        deleteMaintenance,
        getMaintenancesByVehicle,
      }}
    >
      {children}
    </MaintenancesContext.Provider>
  );
};

export const useMaintenances = () => {
  const context = useContext(MaintenancesContext);
  if (!context) {
    throw new Error("useMaintenances must be used within MaintenancesProvider");
  }
  return context;
};
