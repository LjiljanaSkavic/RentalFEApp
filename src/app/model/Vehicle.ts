export interface Vehicle {
  id: number;
  vehicleCode: string;
  purchasePrice: number;
  model: string;
  status: VehicleStatus;
  vehicleType?: VehicleType;
}

export type VehicleType = 'Car' | 'ElectricBike' | 'ElectricScooter';

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
