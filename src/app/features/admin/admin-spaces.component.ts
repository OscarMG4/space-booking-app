import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MCTable, MCTdTemplateDirective } from '@mckit/table';
import { MCColumn, MCListResponse } from '@mckit/core';
import { SpaceService } from '../spaces/services/space';
import { Space, SpaceType } from '../../core/models/space';
import { NotificationService } from '../../shared/services/notification-service';

@Component({
  selector: 'app-admin-spaces',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    CheckboxModule,
    ConfirmDialogModule,
    MCTable,
    MCTdTemplateDirective,
  ],
  providers: [ConfirmationService],
  template: `
    <div>
      <div>
        <h1>Administración de Espacios</h1>
        <p-button
          label="Nuevo Espacio"
          icon="pi pi-plus"
          (onClick)="openDialog()"
        />
      </div>

      <p-card>
        <mc-table [columns]="columns" [response]="tableResponse()" [paginator]="true">
          <ng-template mcTdTemplate="is_available" let-row>
            <i
              [class]="
                row.is_available
                  ? 'pi pi-check-circle'
                  : 'pi pi-times-circle'
              "
            ></i>
          </ng-template>

          <ng-template mcTdTemplate="actions" let-row>
            <div>
              <p-button
                icon="pi pi-pencil"
                [text]="true"
                [rounded]="true"
                severity="info"
                (onClick)="openDialog(row)"
              />
              <p-button
                icon="pi pi-trash"
                [text]="true"
                [rounded]="true"
                severity="danger"
                (onClick)="deleteSpace(row)"
              />
            </div>
          </ng-template>
        </mc-table>
      </p-card>
    </div>

    <p-dialog
      [header]="editMode ? 'Editar Espacio' : 'Nuevo Espacio'"
      [(visible)]="displayDialog"
      [modal]="true"
    >
      <form [formGroup]="spaceForm" (ngSubmit)="saveSpace()">
        <div class="field">
          <label for="name">Nombre *</label>
          <input
            pInputText
            formControlName="name"
            placeholder="Nombre del espacio"
          />
        </div>

        <div class="field">
          <label for="description">Descripción *</label>
          <textarea
            pInputTextarea
            formControlName="description"
            rows="3"
            placeholder="Descripción del espacio"
          ></textarea>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="type">Tipo *</label>
              <p-dropdown
                formControlName="type"
                [options]="spaceTypes"
                placeholder="Selecciona tipo"
              />
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="field">
              <label for="location">Ubicación *</label>
              <input
                pInputText
                formControlName="location"
                placeholder="Ubicación"
              />
            </div>
          </div>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="capacity">Capacidad *</label>
              <p-inputNumber
                formControlName="capacity"
                [showButtons]="true"
                [min]="1"
              />
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="field">
              <label for="price_per_hour">Precio/Hora *</label>
              <p-inputNumber
                formControlName="price_per_hour"
                mode="currency"
                currency="USD"
                [showButtons]="true"
                [min]="0"
              />
            </div>
          </div>
        </div>

        <div class="field">
          <div>
            <p-checkbox
              formControlName="is_available"
              [binary]="true"
              inputId="is_available"
            />
            <label for="is_available">Disponible</label>
          </div>
        </div>

        <div>
          <p-button
            label="Cancelar"
            icon="pi pi-times"
            (onClick)="displayDialog = false"
            [outlined]="true"
            type="button"
          />
          <p-button
            label="Guardar"
            icon="pi pi-check"
            [loading]="saving"
            [disabled]="spaceForm.invalid"
            type="submit"
          />
        </div>
      </form>
    </p-dialog>

    <p-confirmDialog />
  `,
})
export class AdminSpacesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly spaceService = inject(SpaceService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);

  spaces = signal<Space[]>([]);
  loading = signal(false);
  displayDialog = false;
  editMode = false;
  saving = false;
  currentSpaceId?: number;

  // Configuración de columnas para MC-Table
  columns: MCColumn[] = [
    { field: 'name', title: 'Nombre', isShow: true, isSortable: true },
    { field: 'type', title: 'Tipo', isShow: true },
    { field: 'capacity', title: 'Capacidad', isShow: true, isSortable: true },
    { field: 'price_per_hour', title: 'Precio/Hora', isShow: true, isSortable: true },
    { field: 'location', title: 'Ubicación', isShow: true },
    { field: 'is_available', title: 'Disponible', isShow: true },
    { field: 'actions', title: 'Acciones', isShow: true },
  ];


  tableResponse = computed<MCListResponse<Space>>(() => {
    return {
      data: this.spaces(),
      total: this.spaces().length,
      per_page: 10,
      current_page: 1,
      last_page: Math.ceil(this.spaces().length / 10),
    };
  });

  spaceTypes = [
    { label: 'Sala de Reuniones', value: 'sala_reuniones' },
    { label: 'Oficina', value: 'oficina' },
    { label: 'Auditorio', value: 'auditorio' },
    { label: 'Laboratorio', value: 'laboratorio' },
    { label: 'Espacio Coworking', value: 'espacio_coworking' },
    { label: 'Otro', value: 'otro' },
  ];

  spaceForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    type: ['sala_reuniones', Validators.required],
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
          this.spaces.set(response.data.data);
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
        type: 'sala_reuniones',
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
}
