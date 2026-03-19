export interface User {
  idUser: number;
  lastName: string;
  name: string;
  mail: string;
  idRole: number;
  createAt: Date;
  password: string;
}

export interface RegisterUserRequest {
  lastName: string;
  name: string;
  mail: string;
  password: string;
}

export interface LoginUserRequest {
  mail: string;
  password: string;
}
