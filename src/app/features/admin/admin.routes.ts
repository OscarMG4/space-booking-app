import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'spaces', pathMatch: 'full' },
  {
    path: 'spaces',
    loadComponent: () =>
      import('./admin-spaces.component').then((m) => m.AdminSpacesComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./admin-users.component').then((m) => m.AdminUsersComponent),
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./admin-reviews.component').then((m) => m.AdminReviewsComponent),
  },
];
