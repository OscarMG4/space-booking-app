import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpaceService } from './services/space';
import { Space, SpaceType } from '../../core/models/space';
import { NotificationService } from '../../shared/services/notification-service';

@Component({
  selector: 'app-space-list',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
    ProgressSpinnerModule,
  ],
  standalone: true,
  templateUrl: './space-list.component.html',
  styleUrls: ['./space-list.component.scss'],
})
export class SpaceListComponent implements OnInit {
  private readonly spaceService = inject(SpaceService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  spaces = signal<Space[]>([]);
  loading = signal(false);

  filters = {
    search: '',
    type: undefined as SpaceType | undefined,
    min_capacity: undefined as number | undefined,
    max_price: undefined as number | undefined,
    is_available: undefined as boolean | undefined,
  };

  spaceTypes = [
    { label: 'Sala de Reuniones', value: 'sala_reuniones' },
    { label: 'Oficina', value: 'oficina' },
    { label: 'Auditorio', value: 'auditorio' },
    { label: 'Laboratorio', value: 'laboratorio' },
    { label: 'Espacio Coworking', value: 'espacio_coworking' },
    { label: 'Otro', value: 'otro' },
  ];

  ngOnInit(): void {
    this.loadSpaces();
  }

  applyFilters(): void {
    this.loadSpaces();
  }

  loadSpaces(): void {
    this.loading.set(true);
    
    const cleanFilters = Object.fromEntries(
      Object.entries(this.filters).filter(([_, value]) => value !== undefined && value !== '' && value !== null)
    );

    if (cleanFilters['is_available'] !== undefined) {
      cleanFilters['is_available'] = cleanFilters['is_available'] ? 1 : 0;
    }

    this.spaceService.getSpaces(cleanFilters).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {

          this.spaces.set(response.data.data.sort((a, b) => b.id - a.id));
        }
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Error al cargar los espacios');
      },
    });
  }

  viewSpace(id: number): void {
    this.router.navigate(['/spaces', id]);
  }

  bookSpace(id: number): void {
    this.router.navigate(['/bookings/new'], { queryParams: { spaceId: id } });
  }

  getSpaceTypeLabel(type: SpaceType): string {
    const found = this.spaceTypes.find((t) => t.value === type);
    return found?.label || type;
  }
}
