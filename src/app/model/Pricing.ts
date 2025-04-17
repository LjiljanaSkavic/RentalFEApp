import { VehicleType } from "./VehicleDetails";

export interface Pricing {
    id: number;
    vehicleType: VehicleType;
    pricePerDay: number;
}
