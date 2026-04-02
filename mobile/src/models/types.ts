export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  title: string;
  dueDate: string;
  reminderDaysBefore: number;
  type: 'date' | 'interval';
  notes?: string;
  createdAt: string;
}
