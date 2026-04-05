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
    setMaintenances(data);
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
