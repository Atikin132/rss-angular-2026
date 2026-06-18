import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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

      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
      });
    });
  }

  editProfile(): void {
    this.isEditMode.set(true);
    this.profileForm.enable();
  }

  saveProfile(): void {
    this.isEditMode.set(false);
    this.profileForm.disable();
  }

  cancelEdit(): void {
    this.isEditMode.set(false);
    this.profileForm.disable();
  }
}
