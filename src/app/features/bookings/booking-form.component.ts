import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { SpaceService } from '../spaces/services/space';
import { BookingService } from './services/booking';
import { Space } from '../../core/models/space';
import { NotificationService } from '../../shared/services/notification-service';
import { PageHeaderComponent, FormSectionComponent, CardWrapperComponent } from '../../shared/components';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    PageHeaderComponent,
    FormSectionComponent,
    CardWrapperComponent,
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly spaceService = inject(SpaceService);
  private readonly bookingService = inject(BookingService);
  private readonly notificationService = inject(NotificationService);

  spaces = signal<Space[]>([]);
  loadingSpaces = signal(false);
  loading = false;
  minDate = new Date();
  bookingId = signal<number | null>(null);
  isEditMode = signal(false);

  bookingForm: FormGroup = this.fb.group({
    space_id: [null, Validators.required],
    start_time: [null, Validators.required],
    end_time: [null, Validators.required],
    event_title: ['', Validators.required],
    event_description: [''],
    attendees_count: [1, [Validators.required, Validators.min(1)]],
    special_requirements: [''],
  });

  ngOnInit(): void {
    this.loadSpaces();

    // Verificar si estamos en modo de edición
    const bookingIdParam = this.route.snapshot.paramMap.get('id');
    if (bookingIdParam) {
      this.bookingId.set(Number(bookingIdParam));
      this.isEditMode.set(true);
      this.loadBooking(Number(bookingIdParam));
    } else {
      // crear
      const spaceId = this.route.snapshot.queryParamMap.get('spaceId');
      if (spaceId) {
        this.bookingForm.patchValue({ space_id: Number(spaceId) });
      }
    }
  }

  loadSpaces(): void {
    this.loadingSpaces.set(true);
    this.spaceService.getSpaces({ is_available: true }).subscribe({
      next: (response) => {
        this.loadingSpaces.set(false);
        if (response.success && response.data) {
          // back devuelve paginación con estructura data.data
          this.spaces.set(response.data.data);
        }
      },
      error: () => {
        this.loadingSpaces.set(false);
        this.notificationService.error('Error al cargar los espacios');
      },
    });
  }

  loadBooking(id: number): void {
    this.loading = true;
    this.bookingService.getBooking(id).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data) {
          const booking = response.data;
          this.bookingForm.patchValue({
            space_id: booking.space_id,
            start_time: new Date(booking.start_time),
            end_time: new Date(booking.end_time),
            event_title: booking.event_title,
            event_description: booking.event_description,
            attendees_count: booking.attendees_count,
            special_requirements: booking.special_requirements,
          });
        }
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Error al cargar la reserva');
        this.router.navigate(['/bookings']);
      },
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) return;

    this.loading = true;
    const formData = {
      ...this.bookingForm.value,
      start_time: this.formatDate(this.bookingForm.value.start_time),
      end_time: this.formatDate(this.bookingForm.value.end_time),
    };

    const request = this.isEditMode()
      ? this.bookingService.updateBooking(this.bookingId()!, formData)
      : this.bookingService.createBooking(formData);

    request.subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          const message = this.isEditMode()
            ? 'Reserva actualizada exitosamente'
            : 'Reserva creada exitosamente';
          this.notificationService.success(message);
          this.router.navigate(['/bookings']);
        }
      },
      error: (error) => {
        this.loading = false;
        const action = this.isEditMode() ? 'actualizar' : 'crear';
        const message = error?.error?.message || `Error al ${action} la reserva`;
        this.notificationService.error(message);
      },
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  cancel(): void {
    this.router.navigate(['/spaces']);
  }
}
