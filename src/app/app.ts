import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from './core/services/auth';

// Main application component
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

  menuItems: MenuItem[] = [
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
      label: 'Admin',
      icon: 'pi pi-cog',
      visible: this.authService.isAdmin(),
      command: () => this.router.navigate(['/admin/spaces']),
    },
  ];

  logout(): void {
    this.authService.logout();
  }
}
