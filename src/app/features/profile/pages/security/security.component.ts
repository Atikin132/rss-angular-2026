import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-security',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
})
export class SecurityComponent {
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
      ],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  savePassword(): void {
    if (this.passwordForm.invalid || !this.passwordsMatch()) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.passwordForm.reset();
  }

  passwordsMatch(): boolean {
    const { newPassword, confirmPassword } = this.passwordForm.getRawValue();

    return newPassword === confirmPassword;
  }
}
