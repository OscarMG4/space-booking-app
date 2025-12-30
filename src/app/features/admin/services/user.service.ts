import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse, ApiResponse } from '../../../core/models';
import { UserListItem, CreateUserRequest, UpdateUserRequest, Role } from '../../../core/models/user';
import { ApiService } from '../../../core/services';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);

  getUsers(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    is_active?: boolean;
    role?: string;
  }): Observable<ApiResponse<UserListItem[]> & { meta?: { total: number; per_page: number; current_page: number; last_page: number } }> {
    return this.apiService.get<ApiResponse<UserListItem[]> & { meta?: { total: number; per_page: number; current_page: number; last_page: number } }>('users', params ? { params } : undefined);
  }

  getUser(id: number): Observable<ApiResponse<UserListItem>> {
    return this.apiService.get<ApiResponse<UserListItem>>(`users/${id}`);
  }

  createUser(data: CreateUserRequest): Observable<ApiResponse<UserListItem>> {
    return this.apiService.post<ApiResponse<UserListItem>>('users', data);
  }

  updateUser(
    id: number,
    data: UpdateUserRequest
  ): Observable<ApiResponse<UserListItem>> {
    return this.apiService.put<ApiResponse<UserListItem>>(`users/${id}`, data);
  }

  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`users/${id}`);
  }

  getRoles(): Observable<ApiResponse<Role[]>> {
    return this.apiService.get<ApiResponse<Role[]>>('roles');
  }
}
