import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService } from 'primeng/api';
import { ReviewService } from './services/review.service';
import { Review } from '../../core/models/review';
import { NotificationService } from '../../shared/services/notification-service';
import { PageHeaderComponent, CardWrapperComponent } from '../../shared/components';

@Component({
  selector: 'app-admin-reviews',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextareaModule,
    TagModule,
    ConfirmDialogModule,
    TableModule,
    TooltipModule,
    ProgressSpinnerModule,
    PageHeaderComponent,
    CardWrapperComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.scss'
})
export class AdminReviewsComponent implements OnInit {
  private readonly reviewService = inject(ReviewService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly notificationService = inject(NotificationService);

  reviews = signal<Review[]>([]);
  loading = signal(false);
  displayRejectDialog = false;
  selectedReview: Review | null = null;
  rejectReason = '';

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading.set(true);
    this.reviewService.getReviews().subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.reviews.set(response.data.sort((a, b) => b.id - a.id));
        }
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Error al cargar reseñas', 'Error');
      },
    });
  }

  approveReview(review: Review): void {
    this.confirmationService.confirm({
      message: `¿Aprobar la reseña de ${review.user?.name || 'este usuario'}?`,
      header: 'Confirmar aprobación',
      icon: 'pi pi-check-circle',
      accept: () => {
        this.reviewService.approveReview(review.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success(
                response.message || 'Reseña aprobada exitosamente',
                'Éxito'
              );
              this.loadReviews();
            }
          },
          error: () => {
            this.notificationService.error('Error al aprobar reseña', 'Error');
          },
        });
      },
    });
  }

  openRejectDialog(review: Review): void {
    this.selectedReview = review;
    this.rejectReason = '';
    this.displayRejectDialog = true;
  }

  rejectReview(): void {
    if (!this.selectedReview || !this.rejectReason) return;

    this.reviewService.rejectReview(this.selectedReview.id, { reason: this.rejectReason }).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success(
            response.message || 'Reseña rechazada exitosamente',
            'Éxito'
          );
          this.displayRejectDialog = false;
          this.loadReviews();
        }
      },
      error: () => {
        this.notificationService.error('Error al rechazar reseña', 'Error');
      },
    });
  }

  deleteReview(review: Review): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar esta reseña permanentemente?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.reviewService.deleteReview(review.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success(
                response.message || 'Reseña eliminada exitosamente',
                'Éxito'
              );
              this.loadReviews();
            }
          },
          error: () => {
            this.notificationService.error('Error al eliminar reseña', 'Error');
          },
        });
      },
    });
  }

  getStatusSeverity(review: Review): 'success' | 'warning' | 'danger' {
    if (review.is_flagged) return 'danger';
    if (review.is_approved) return 'success';
    return 'warning';
  }

  getStatusLabel(review: Review): string {
    if (review.is_flagged) return 'Rechazada';
    if (review.is_approved) return 'Aprobada';
    return 'Pendiente';
  }
}
