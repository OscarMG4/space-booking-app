import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'spaces', pathMatch: 'full' },
  {
    path: 'spaces',
    loadComponent: () =>
      import('./admin-spaces.component').then((m) => m.AdminSpacesComponent),
  },
];
