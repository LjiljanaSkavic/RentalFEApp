import { RentalAppFile } from "./RentalAppFile";

export type UserRole = 'Manager' | 'Administrator' | 'Operator';

export interface AppUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  image: RentalAppFile;
}
