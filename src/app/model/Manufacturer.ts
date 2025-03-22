export interface Manufacturer extends ManufacturerRequest {
  id: number;
}

export interface ManufacturerRequest {
  name: string;
  country: string;
  address: string;
  email: string;
  phone: string;
  fax: string;
}

