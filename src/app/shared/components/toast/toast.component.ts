import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export interface ToastData {
  message: string;
  type: 'error';
}

@Component({
  selector: 'app-toast',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  private readonly snackBarRef = inject(MatSnackBarRef<ToastComponent>);

  readonly data = inject<ToastData>(MAT_SNACK_BAR_DATA);

  close(): void {
    this.snackBarRef.dismiss();
  }
}
