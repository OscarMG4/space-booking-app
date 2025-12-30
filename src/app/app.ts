import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, ToastModule, ButtonModule, MenubarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Space Booking');
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  get menuItems(): MenuItem[] {
    const user = this.authService.currentUser();
    const isAdmin = user?.is_admin === true;
    const isManager = user?.role === 'Gestor';
    const canManage = isAdmin || isManager;

    return [
      {
        label: 'Espacios',
        icon: 'pi pi-building',
        command: () => this.router.navigate(['/spaces']),
      },
      {
        label: 'Mis Reservas',
        icon: 'pi pi-calendar',
        command: () => this.router.navigate(['/bookings']),
      },
      {
        label: 'Gestión',
        icon: 'pi pi-cog',
        visible: canManage,
        items: [
          {
            label: 'Espacios',
            icon: 'pi pi-building',
            visible: canManage,
            command: () => this.router.navigate(['/admin/spaces']),
          },
          {
            label: 'Reseñas',
            icon: 'pi pi-star',
            visible: canManage,
            command: () => this.router.navigate(['/admin/reviews']),
          },
          {
            label: 'Usuarios',
            icon: 'pi pi-users',
            visible: isAdmin,
            command: () => this.router.navigate(['/admin/users']),
          },
        ],
      },
    ];
  }

  logout(): void {
    this.authService.logout();
  }
}
