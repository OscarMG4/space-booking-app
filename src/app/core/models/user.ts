export interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  is_active: boolean;
  is_admin: boolean;
  role?: Role;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  department?: string;
  role_id: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  department?: string;
  is_active?: boolean;
  role_id?: number;
}
