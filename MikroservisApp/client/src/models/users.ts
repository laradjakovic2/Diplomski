import { UserRole } from "./Enums";

export interface CreateUser {
  firstName:string;
  lastName: string;
  birthDate: Date;
  email: string;
  password: string;
  roleId: UserRole;
}

export interface LoginUser{
  email:string;
  password: string;
}

export interface UserDto extends CreateUser{
  id: number;
}
