export interface CreateUser {
  firstName:string;
  lastName: string;
  birthDate: Date;
}

export interface UserDto extends CreateUser{
  id: number;
}
