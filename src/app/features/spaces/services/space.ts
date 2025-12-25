import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services';
import { ApiResponse, PaginatedResponse, CreateSpaceRequest, Space, SpaceFilters, UpdateSpaceRequest } from '../../../core/models';


@Injectable({
  providedIn: 'root',
})
export class SpaceService {
  private readonly apiService = inject(ApiService);

  getSpaces(filters?: SpaceFilters): Observable<ApiResponse<PaginatedResponse<Space>>> {
    return this.apiService.get<ApiResponse<PaginatedResponse<Space>>>('spaces', filters);
  }

  getSpace(id: number): Observable<ApiResponse<Space>> {
    return this.apiService.get<ApiResponse<Space>>(`spaces/${id}`);
  }

  createSpace(data: CreateSpaceRequest): Observable<ApiResponse<Space>> {
    return this.apiService.post<ApiResponse<Space>>('spaces', data);
  }

  updateSpace(id: number, data: UpdateSpaceRequest): Observable<ApiResponse<Space>> {
    return this.apiService.put<ApiResponse<Space>>(`spaces/${id}`, data);
  }

  deleteSpace(id: number): Observable<ApiResponse> {
    return this.apiService.delete<ApiResponse>(`spaces/${id}`);
  }
}
