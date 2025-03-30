export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}
