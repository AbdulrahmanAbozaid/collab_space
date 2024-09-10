export interface User {
  _id: string;
  username: string;
  email: string;
  roles: string[];
  notifications: any[]; // If you know the shape of the notifications, you can replace `any` with the appropriate type.
  isActive: boolean;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface emailCredentials {
  email: string;
  otp: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export type RegisterResponse = {
  success: boolean;
  message: string;
};
