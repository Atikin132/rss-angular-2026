import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private readonly snackBar = inject(MatSnackBar);

  error(message: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: {
        message,
        type: 'error',
      },
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-toast'],
    });
  }
}
