import { Rental } from "./Rental";
import { Malfunction } from "./Malfunction";

export type VehicleType = 'CAR' | 'E_BIKE' | 'E_SCOOTER'

export interface VehicleDetails {
  type: VehicleType;
  rentals: Rental[];
  malfunctions: Malfunction[];
}
