import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BookingService } from './services/booking';
import { Booking } from '../../core/models/booking';
import { NotificationService } from '../../shared/services/notification-service';
import { PageHeaderComponent, CardWrapperComponent } from '../../shared/components';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    PageHeaderComponent,
    CardWrapperComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);

  bookings = signal<Booking[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.bookingService.getMyBookings().subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.bookings.set(response.data.data);
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
      message: '¿Estás seguro de cancelar esta reserva?',
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bookingService.cancelBooking(booking.id).subscribe({
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
}
