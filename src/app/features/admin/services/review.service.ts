import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateReviewRequest, ModerateReviewRequest, Review } from '../../../core/models/review';
import { PaginatedResponse, ApiResponse } from '../../../core/models';
import { ApiService } from '../../../core/services';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly apiService = inject(ApiService);

  getReviews(params?: {
    page?: number;
    per_page?: number;
    space_id?: number;
    is_approved?: boolean;
    is_flagged?: boolean;
    rating?: number;
  }): Observable<ApiResponse<Review[]> & { meta?: { total: number; per_page: number; current_page: number; last_page: number } }> {
    return this.apiService.get<ApiResponse<Review[]> & { meta?: { total: number; per_page: number; current_page: number; last_page: number } }>('reviews', {
      params,
    });
  }

  createReview(data: CreateReviewRequest): Observable<ApiResponse<Review>> {
    return this.apiService.post<ApiResponse<Review>>('reviews', data);
  }

  approveReview(id: number): Observable<ApiResponse<Review>> {
    return this.apiService.post<ApiResponse<Review>>(
      `reviews/${id}/approve`,
      {}
    );
  }

  rejectReview(
    id: number,
    data: ModerateReviewRequest
  ): Observable<ApiResponse<Review>> {
    return this.apiService.post<ApiResponse<Review>>(
      `reviews/${id}/reject`,
      data
    );
  }

  deleteReview(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`reviews/${id}`);
  }
}
