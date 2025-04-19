import { VehicleCategory, VehicleStatus } from "./Vehicle";

export interface VehicleRequest {
  category: VehicleCategory;
  code: string;
  purchasePrice: number;
  model: string;
  status: VehicleStatus;
  manufacturerId?: number;
  vehiclePictureId?: number;
  description?: string;
  acquisitionDate?: Date;
  rangePerCharge?: number;
  maxSpeed?: number;
}
