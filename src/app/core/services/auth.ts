import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api';
import { TokenService } from './token';
import { ApiResponse } from '../models/api';
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);

  constructor() {
    if (this.tokenService.isAuthenticated()) {
      this.loadUserProfile();
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/register', data).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.handleAuthSuccess(response.data.token, response.data.user);
        }
      })
    );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/login', credentials).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.handleAuthSuccess(response.data.token, response.data.user);
        }
      })
    );
  }

  logout(): void {
    this.handleLogout();
    this.apiService.post<ApiResponse>('auth/logout', {}).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  refreshToken(): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/refresh', {}).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.tokenService.setToken(response.data.token);
        }
      })
    );
  }

  getProfile(): Observable<ApiResponse<User>> {
    return this.apiService.get<ApiResponse<User>>('auth/me');
  }

  private loadUserProfile(): void {
    this.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentUser.set(response.data);
          this.isAuthenticated.set(true);
        }
      },
      error: () => {
        this.handleLogout();
      },
    });
  }

  private handleAuthSuccess(token: string, user: User): void {
    this.tokenService.setToken(token);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  private handleLogout(): void {
    this.tokenService.removeToken();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.is_admin === true;
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role;
  }

  isManager(): boolean {
    return this.hasRole('Gestor');
  }

  isUser(): boolean {
    return this.hasRole('Usuario');
  }
}
