import { RentalAppFile } from "./RentalAppFile";

export type UserRole = 'Manager' | 'Admin' | 'Operator';

export interface AppUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture: RentalAppFile;
  role: UserRole;
  deleted: boolean;
}

export interface Client extends AppUser {
  cardNumber: string;
  isBlocked: boolean;
}

