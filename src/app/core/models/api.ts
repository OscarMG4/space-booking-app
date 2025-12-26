export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}
