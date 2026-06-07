import { Component, inject, signal } from '@angular/core';
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
  private readonly profile = inject(ProfileService).getUserProfile();

  readonly isEditMode = signal(false);
  readonly profileForm = new FormGroup({
    firstName: new FormControl({ value: this.profile.firstName, disabled: true }, [
      Validators.required,
    ]),
    lastName: new FormControl({ value: this.profile.lastName, disabled: true }, [
      Validators.required,
    ]),
    email: new FormControl({ value: this.profile.email, disabled: true }, [
      Validators.email,
      Validators.required,
    ]),
    dateOfBirth: new FormControl({ value: new Date(this.profile.dateOfBirth), disabled: true }, [
      Validators.required,
    ]),
  });

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
