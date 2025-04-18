import { Vehicle } from "./Vehicle";

export interface MalfunctionRequest {
  date: Date;
  time: string;
  description: string;
  isDeleted: boolean;
  vehicleId: number | null;
}

export interface Malfunction {
  id: number;
  date: Date;
  time: string;
  description: string;
  deleted: boolean;
  vehicle: Vehicle;
}
