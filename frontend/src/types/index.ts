export enum Role {
  GLOBAL_ADMIN = 0,
  ADMIN_USER = 1,
  STANDARD_USER = 2,
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  permissions: string[];
  isValidated: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
