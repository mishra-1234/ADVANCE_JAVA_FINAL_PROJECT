export interface User {
  id?: number;
  fullName: string;
  employeeId: string;
  email: string;
  department: string;
  password?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  employeeId: string;
  email: string;
  department: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}
