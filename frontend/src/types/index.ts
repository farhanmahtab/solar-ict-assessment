export enum Role {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  ADMIN_USER = 'ADMIN_USER',
  STANDARD_USER = 'STANDARD_USER',
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
