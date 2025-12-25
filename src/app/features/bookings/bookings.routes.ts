import { Routes } from '@angular/router';

export const bookingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./my-bookings.component').then((m) => m.MyBookingsComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./booking-form.component').then((m) => m.BookingFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./booking-form.component').then((m) => m.BookingFormComponent),
  },
];
