import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { SpaceService } from './services/space';
import { Space } from '../../core/models/space';
import { NotificationService } from '../../shared/services/notification-service';

@Component({
  selector: 'app-space-detail',
  imports: [CommonModule, CardModule, ButtonModule, ProgressSpinnerModule, DividerModule],
  templateUrl: './space-detail.component.html',
  styleUrls: ['./space-detail.component.scss']
})
export class SpaceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly spaceService = inject(SpaceService);
  private readonly notificationService = inject(NotificationService);

  space = signal<Space | null>(null);
  loading = signal(false);

  spaceTypes = [
    { label: 'Sala de Reuniones', value: 'sala_reuniones' },
    { label: 'Oficina', value: 'oficina' },
    { label: 'Auditorio', value: 'auditorio' },
    { label: 'Laboratorio', value: 'laboratorio' },
    { label: 'Espacio Coworking', value: 'espacio_coworking' },
    { label: 'Otro', value: 'otro' },
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadSpace(id);
    }
  }

  loadSpace(id: number): void {
    this.loading.set(true);
    this.spaceService.getSpace(id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.space.set(response.data);
        }
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Error al cargar el espacio');
        this.router.navigate(['/spaces']);
      },
    });
  }

  createBooking(): void {
    this.router.navigate(['/bookings/new'], { queryParams: { spaceId: this.space()!.id } });
  }

  goBack(): void {
    this.router.navigate(['/spaces']);
  }

  getSpaceTypeLabel(type: string): string {
    const found = this.spaceTypes.find((t) => t.value === type);
    return found?.label || type;
  }
}
