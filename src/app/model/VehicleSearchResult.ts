import { Vehicle } from "./Vehicle";

export interface VehicleSearchResult {
  vehicles: Vehicle[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
}
