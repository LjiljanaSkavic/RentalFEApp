import { RentalAppFile } from "./RentalAppFile";

export type UserRole = 'Manager' | 'Admin' | 'Operator';

export interface AppUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePicture: RentalAppFile;
}
