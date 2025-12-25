import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth';
import { adminGuard } from './core/guards/admin';
import { guestGuard } from './core/guards/guest';

export const routes: Routes = [
  { path: '', redirectTo: '/spaces', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register.component').then((m) => m.RegisterComponent),
      },
    ],
  },
  {
    path: 'spaces',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/spaces/space-list.component').then((m) => m.SpaceListComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/spaces/space-detail.component').then((m) => m.SpaceDetailComponent),
      },
    ],
  },
  {
    path: 'bookings',
    canActivate: [authGuard],
    loadChildren: () => import('./features/bookings/bookings.routes').then((m) => m.bookingsRoutes),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  { path: '**', redirectTo: '/spaces' },
];
