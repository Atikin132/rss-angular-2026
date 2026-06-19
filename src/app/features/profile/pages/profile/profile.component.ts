import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Customer } from '../../../../core/models/customer.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private readonly profileService = inject(ProfileService);

  readonly user = this.profileService.user;
  readonly errorMessage = this.profileService.errorMessage;
  readonly isSaving = this.profileService.isProfileSaving;
  readonly isEditMode = signal(false);
  readonly profileForm = new FormGroup({
    firstName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    lastName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    email: new FormControl({ value: '', disabled: true }, [Validators.email, Validators.required]),
    dateOfBirth: new FormControl<Date | null>({ value: null, disabled: true }, [
      Validators.required,
    ]),
  });

  constructor() {
    this.profileService.loadUser();

    effect(() => {
      const user = this.profileService.user();

      if (!user) return;

      this.patchForm(user);
    });

    effect(() => {
      if (!this.profileService.isProfileUpdated()) return;

      this.isEditMode.set(false);
      this.profileForm.disable();
      this.profileService.resetProfileUpdatedState();
    });
  }

  private patchForm(user: Customer): void {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  editProfile(): void {
    this.isEditMode.set(true);
    this.profileForm.enable();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, dateOfBirth } = this.profileForm.getRawValue();

    if (!firstName || !lastName || !email || !dateOfBirth) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.profileService.submitProfileUpdate({
      firstName,
      lastName,
      email,
      dateOfBirth: this.formatDate(dateOfBirth),
    });
  }

  cancelEdit(): void {
    const user = this.user();

    if (user) {
      this.patchForm(user);
    }

    this.isEditMode.set(false);
    this.profileForm.disable();
  }
}
