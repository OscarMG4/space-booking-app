import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse, Booking, CreateBookingRequest, UpdateBookingRequest } from '../../../core/models';
import { ApiService } from '../../../core/services';

// Service for managing bookings
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly apiService = inject(ApiService);

  getMyBookings(): Observable<ApiResponse<PaginatedResponse<Booking>>> {
    return this.apiService.get<ApiResponse<PaginatedResponse<Booking>>>('bookings');
  }

  getBooking(id: number): Observable<ApiResponse<Booking>> {
    return this.apiService.get<ApiResponse<Booking>>(`bookings/${id}`);
  }

  createBooking(data: CreateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.apiService.post<ApiResponse<Booking>>('bookings', data);
  }

  updateBooking(id: number, data: UpdateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.apiService.put<ApiResponse<Booking>>(`bookings/${id}`, data);
  }

  cancelBooking(id: number): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`bookings/${id}/cancel`, {});
  }

  deleteBooking(id: number): Observable<ApiResponse> {
    return this.apiService.delete<ApiResponse>(`bookings/${id}`);
  }
}
