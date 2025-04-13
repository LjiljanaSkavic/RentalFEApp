import { VehicleCategory, VehicleStatus } from "./Vehicle";

export interface VehicleRequest {
    category: VehicleCategory;
    uuid: string;
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
