import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BookingService } from './services/booking';
import { Booking } from '../../core/models/booking';
import { NotificationService } from '../../shared/services/notification-service';
import { PageHeaderComponent } from '../../shared/components';
import { ReviewService } from '../admin/services/review.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    DialogModule,
    RatingModule,
    InputTextareaModule,
    ProgressSpinnerModule,
    PageHeaderComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly reviewService = inject(ReviewService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);

  bookings = signal<Booking[]>([]);
  loading = signal(false);
  showReviewForm: { [key: number]: boolean } = {};
  reviewRatings: { [key: number]: number } = {};
  reviewComments: { [key: number]: string } = {};

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.bookingService.getMyBookings().subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.bookings.set(response.data.data.sort((a, b) => b.id - a.id));
        }
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Error al cargar las reservas');
      },
    });
  }

  createBooking(): void {
    this.router.navigate(['/bookings/new']);
  }

  editBooking(id: number): void {
    this.router.navigate(['/bookings/edit', id]);
  }

  cancelBooking(booking: Booking): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de cancelar esta reserva? Por favor, indica la razón.',
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const reason = prompt('Razón de cancelación:');
        if (!reason) {
          this.notificationService.error('Debe proporcionar una razón para cancelar');
          return;
        }

        this.bookingService.cancelBooking(booking.id, { cancellation_reason: reason }).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success('Reserva cancelada');
              this.loadBookings();
            }
          },
          error: () => {
            this.notificationService.error('Error al cancelar la reserva');
          },
        });
      },
    });
  }

  deleteBooking(booking: Booking): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar esta reserva permanentemente?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.bookingService.deleteBooking(booking.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success('Reserva eliminada');
              this.loadBookings();
            }
          },
          error: () => {
            this.notificationService.error('Error al eliminar la reserva');
          },
        });
      },
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | undefined {
    const severities: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'danger',
      completed: 'info',
    };
    return severities[status];
  }

  canAddReview(booking: Booking): boolean {
    return booking.status === 'completed' && !booking.review_id;
  }

  toggleReviewForm(bookingId: number): void {
    this.showReviewForm[bookingId] = !this.showReviewForm[bookingId];
    if (!this.showReviewForm[bookingId]) {
      delete this.reviewRatings[bookingId];
      delete this.reviewComments[bookingId];
    }
  }

  submitReview(booking: Booking): void {
    const rating = this.reviewRatings[booking.id] || 0;
    
    if (rating === 0) {
      this.notificationService.error('Por favor selecciona una calificación');
      return;
    }

    const reviewData: any = {
      space_id: booking.space_id,
      booking_id: booking.id,
      rating: rating,
    };

    const comment = this.reviewComments[booking.id];
    if (comment) {
      reviewData.comment = comment;
    }

    this.reviewService.createReview(reviewData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Reseña enviada exitosamente');
          this.showReviewForm[booking.id] = false;
          delete this.reviewRatings[booking.id];
          delete this.reviewComments[booking.id];
          this.loadBookings();
        }
      },
      error: () => {
        this.notificationService.error('Error al enviar la reseña');
      },
    });
  }
}
