import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly messageService = inject(MessageService);

  success(message: string, title: string = 'Éxito'): void {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000,
    });
  }

  error(message: string, title: string = 'Error'): void {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 5000,
    });
  }

  info(message: string, title: string = 'Información'): void {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: 3000,
    });
  }

  warn(message: string, title: string = 'Advertencia'): void {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: 4000,
    });
  }
}
