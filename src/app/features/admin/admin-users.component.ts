import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService } from 'primeng/api';
import { UserService } from './services/user.service';
import { Role, UserListItem, CreateUserRequest, UpdateUserRequest } from '../../core/models/user';
import { NotificationService } from '../../shared/services/notification-service';
import { AuthService } from '../../core/services/auth';
import { PageHeaderComponent, CardWrapperComponent } from '../../shared/components';

@Component({
  selector: 'app-admin-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
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
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  users = signal<UserListItem[]>([]);
  roles = signal<Role[]>([]);
  loading = signal(false);
  displayDialog = false;
  editMode = false;
  selectedUser: UserListItem | null = null;

  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    phone: [''],
    department: [''],
    role_id: ['', Validators.required],
    is_active: [true],
  });

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.users.set(response.data.sort((a, b) => b.id - a.id));
        }
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Error al cargar usuarios:', error);
        this.notificationService.error('Error al cargar usuarios', 'Error');
      },
    });
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.roles.set(response.data);
        }
      },
      error: () => {
        this.notificationService.error('Error al cargar roles', 'Error');
      },
    });
  }

  openDialog(user?: UserListItem): void {
    this.editMode = !!user;
    this.selectedUser = user || null;

    if (user) {
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role_id: user.role?.id,
        is_active: user.is_active,
      });
      this.userForm.get('password')?.clearValidators();
    } else {
      this.userForm.reset({ is_active: true });
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }

    this.userForm.get('password')?.updateValueAndValidity();
    this.displayDialog = true;
  }

  saveUser(): void {
    if (this.userForm.invalid) return;

    const formData = this.userForm.value;
    const request: CreateUserRequest | UpdateUserRequest = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      role_id: formData.role_id,
      is_active: formData.is_active,
    };

    if (formData.password) {
      (request as CreateUserRequest).password = formData.password;
    }

    const operation = this.editMode
      ? this.userService.updateUser(this.selectedUser!.id, request as UpdateUserRequest)
      : this.userService.createUser(request as CreateUserRequest);

    operation.subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success(
            response.message || `Usuario ${this.editMode ? 'actualizado' : 'creado'} exitosamente`,
            'Éxito'
          );
          this.displayDialog = false;
          this.loadUsers();
        }
      },
      error: () => {
        this.notificationService.error(
          `Error al ${this.editMode ? 'actualizar' : 'crear'} usuario`,
          'Error'
        );
      },
    });
  }

  deleteUser(user: UserListItem): void {
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.id === user.id) {
      this.notificationService.error(
        'No puedes eliminar tu propia cuenta',
        'Acción no permitida'
      );
      return;
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar al usuario ${user.name}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.userService.deleteUser(user.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success(
                response.message || 'Usuario eliminado exitosamente',
                'Éxito'
              );
              this.loadUsers();
            }
          },
          error: () => {
            this.notificationService.error('Error al eliminar usuario', 'Error');
          },
        });
      },
    });
  }

  isCurrentUser(user: UserListItem): boolean {
    const currentUser = this.authService.currentUser();
    return currentUser ? currentUser.id === user.id : false;
  }

  getRoleName(user: UserListItem): string {
    return user.role?.name || 'Sin rol';
  }

  getRoleSeverity(user: UserListItem): 'success' | 'info' | 'warning' | 'danger' | undefined {
    if (user.is_admin) return 'danger';
    const roleName = user.role?.name?.toLowerCase();
    if (roleName?.includes('admin')) return 'danger';
    if (roleName?.includes('gestor')) return 'warning';
    return 'info';
  }
}
