export interface Rental {
  id: number;
  start: Date;
  end: Date;
  startLocation: Point;
  endLocation: Point;
  duration: string;
  identificationCard: string;
  driverLicence: string;
  userFirstAndLastName: string;
  vehicleCodeAndModel: string;
}

export interface Point {
  lat: number;
  lng: number;
}
