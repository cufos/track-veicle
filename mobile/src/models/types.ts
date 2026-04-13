export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;

  fuelType: "gasolina" | "diesel" | "electrico" | "hibrido";
  vehicleType: "carro" | "motor" | "van" | "otro";

  purchaseDate?: string;
  km?: number;

  imageUrl?: string;
  createdAt: string;
}

export type MaintenanceCategory =
  | "maintenance"
  | "service"
  | "inspection"
  | "tires"
  | "tax"
  | "insurance"
  | "other";

export interface Maintenance {
  id: string;
  vehicleId: string;

  // ✅ Nueva arquitectura: categoría interna traducible
  category: MaintenanceCategory;

  // ✅ Solo descripción, sin prefijo de categoría
  title: string;

  dueDate: string;
  reminderDaysBefore: number;
  type: "date" | "interval";
  notes?: string;
  cost?: number;
  kilometers?: number;
  createdAt: string;
}
