import { RentalAppFile } from "./RentalAppFile";
import { VehicleDetails } from "./VehicleDetails";

export interface Vehicle {
  id: number;
  vehicleCode: string;
  purchasePrice: number;
  model: string;
  status: VehicleStatus;
  manufacturerId: number;
  image: RentalAppFile;
}

export enum VehicleCategory {
  CAR = 'CAR',
  E_BIKE = 'E_BIKE',
  E_SCOOTER = 'E_SCOOTER',
}

export enum VehicleStatus {
  RENTED = 'Rented',
  AVAILABLE = 'Available',
  BROKEN = 'Broken',
}

export interface Car extends Vehicle {
  acquisitionDate: Date;
  description: string;
}

export interface ElectricBike extends Vehicle {
  rangePerCharge: number;
}

export interface ElectricScooter extends Vehicle {
  maxSpeed: number;
}

export interface CarDetails extends Car, VehicleDetails {
}

export interface ElectricBikeDetails extends ElectricBike, VehicleDetails {
}

export interface ElectricScooterDetails extends ElectricScooter, VehicleDetails {
}
