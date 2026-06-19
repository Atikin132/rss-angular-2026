import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { ProfileService } from '../../services/profile.service';

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
  private readonly profileService = inject(ProfileService);

  readonly errorMessage = this.profileService.errorMessage;
  readonly isPasswordSaving = this.profileService.isPasswordSaving;

  readonly passwordForm = new FormGroup(
    {
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
    },
    {
      validators: [passwordMatchValidator('newPassword', 'confirmPassword')],
    },
  );

  constructor() {
    effect(() => {
      if (!this.profileService.isPasswordChanged()) return;

      this.passwordForm.reset();
      this.profileService.resetPasswordChangedState();
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();

    this.profileService.submitPasswordChange({
      currentPassword,
      newPassword,
    });
  }
}
