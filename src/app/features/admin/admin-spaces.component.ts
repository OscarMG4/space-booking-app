import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService } from 'primeng/api';
import { SpaceService } from '../spaces/services/space';
import { Space, SpaceType } from '../../core/models/space';
import { NotificationService } from '../../shared/services/notification-service';
import { AuthService } from '../../core/services/auth';
import { PageHeaderComponent, CardWrapperComponent } from '../../shared/components';

@Component({
  selector: 'app-admin-spaces',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    CheckboxModule,
    ConfirmDialogModule,
    TableModule,
    TagModule,
    TooltipModule,
    ProgressSpinnerModule,
    PageHeaderComponent,
    CardWrapperComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './admin-spaces.component.html',
  styleUrl: './admin-spaces.component.scss'
})
export class AdminSpacesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly spaceService = inject(SpaceService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly authService = inject(AuthService);

  spaces = signal<Space[]>([]);
  loading = signal(false);
  displayDialog = false;
  editMode = false;
  saving = false;
  currentSpaceId?: number;

  get isAdmin(): boolean {
    return this.authService.currentUser()?.is_admin === true;
  }

  spaceTypes = [
    { label: 'Sala de Reuniones', value: 'meeting_room' },
    { label: 'Oficina', value: 'office' },
    { label: 'Auditorio', value: 'auditorium' },
    { label: 'Laboratorio', value: 'laboratory' },
    { label: 'Espacio Coworking', value: 'coworking_space' },
    { label: 'Otro', value: 'other' },
  ];

  spaceForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    type: ['meeting_room', Validators.required],
    capacity: [10, [Validators.required, Validators.min(1)]],
    price_per_hour: [50, [Validators.required, Validators.min(0)]],
    location: ['', Validators.required],
    is_available: [true],
  });

  ngOnInit(): void {
    this.loadSpaces();
  }

  loadSpaces(): void {
    this.loading.set(true);
    this.spaceService.getSpaces().subscribe({
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

  openDialog(space?: Space): void {
    this.editMode = !!space;
    this.currentSpaceId = space?.id;

    if (space) {
      this.spaceForm.patchValue(space);
    } else {
      this.spaceForm.reset({
        type: 'meeting_room',
        is_available: true,
        capacity: 10,
        price_per_hour: 50,
      });
    }

    this.displayDialog = true;
  }

  saveSpace(): void {
    if (this.spaceForm.invalid) return;

    this.saving = true;
    const request = this.editMode
      ? this.spaceService.updateSpace(this.currentSpaceId!, this.spaceForm.value)
      : this.spaceService.createSpace(this.spaceForm.value);

    request.subscribe({
      next: (response) => {
        this.saving = false;
        if (response.success) {
          this.notificationService.success(
            this.editMode ? 'Espacio actualizado' : 'Espacio creado'
          );
          this.displayDialog = false;
          this.loadSpaces();
        }
      },
      error: () => {
        this.saving = false;
        this.notificationService.error('Error al guardar el espacio');
      },
    });
  }

  deleteSpace(space: Space): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el espacio "${space.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.spaceService.deleteSpace(space.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success('Espacio eliminado');
              this.loadSpaces();
            }
          },
          error: (error) => {
            const message = error?.error?.message || 'Error al eliminar el espacio';
            this.notificationService.error(message);
          },
        });
      },
    });
  }

  getSpaceTypeLabel(type: SpaceType): string {
    const found = this.spaceTypes.find((t) => t.value === type);
    return found?.label || type;
  }

  getAvailabilitySeverity(isAvailable: boolean): 'success' | 'danger' {
    return isAvailable ? 'success' : 'danger';
  }

  getAvailabilityLabel(isAvailable: boolean): string {
    return isAvailable ? 'Disponible' : 'No disponible';
  }
}
