import { Component, effect, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Customer } from '../../../../core/models/customer.model';
import { ProfileService } from '../../services/profile.service';

const namePattern = /^[\p{L}\s'-]+$/u;

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

  private adultValidator: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    if (!value) return null;

    const today = new Date();
    const birthDate = new Date(value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 ? null : { tooYoung: true };
  };

  readonly profileForm = new FormGroup({
    firstName: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.pattern(namePattern),
    ]),
    lastName: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.pattern(namePattern),
    ]),
    email: new FormControl({ value: '', disabled: true }, [Validators.email, Validators.required]),
    dateOfBirth: new FormControl<Date | null>({ value: null, disabled: true }, [
      Validators.required,
      this.adultValidator,
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
