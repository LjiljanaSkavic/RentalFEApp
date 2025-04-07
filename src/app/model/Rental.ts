import { Client } from "./AppUser";
import { Vehicle } from "./Vehicle";

export interface Rental {
  id: number;
  start: Date;
  end: Date;
  startLocation: Point;
  endLocation: Point;
  duration: string;
  identificationCard: string;
  driverLicence: string;
  client: Client;
  vehicle: Vehicle;
}

export interface Point {
  lat: number;
  lng: number;
}
