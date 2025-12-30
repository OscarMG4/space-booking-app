export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  is_active: boolean;
  is_admin: boolean;
  role: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    token_type: string;
    expires_in: number;
    user: User;
  };
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  department?: string;
}
