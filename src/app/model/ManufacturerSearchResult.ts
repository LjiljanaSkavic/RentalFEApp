import { Manufacturer } from "./Manufacturer";

export interface ManufacturerSearchResult {
  manufacturers: Manufacturer[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
}
