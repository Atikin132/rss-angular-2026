import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-addresses',
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss',
})
export class AddressesComponent {
  private readonly profileService = inject(ProfileService);
  private readonly firstAddress = this.profileService.getUserProfile().addresses[0];

  readonly profile = this.profileService.profile;
  readonly isEditMode = signal(false);
  readonly addressForm = new FormGroup({
    streetName: new FormControl({ value: this.firstAddress?.streetName ?? '', disabled: true }),
    city: new FormControl({ value: this.firstAddress?.city ?? '', disabled: true }),
    postalCode: new FormControl({ value: this.firstAddress?.postalCode ?? '', disabled: true }),
    country: new FormControl({ value: this.firstAddress?.country ?? '', disabled: true }),
    isDefaultShipping: new FormControl({
      value: this.firstAddress?.isDefaultShipping ?? false,
      disabled: true,
    }),
    isDefaultBilling: new FormControl({
      value: this.firstAddress?.isDefaultBilling ?? false,
      disabled: true,
    }),
  });

  editAddress(): void {
    this.isEditMode.set(true);
    this.addressForm.enable();
  }

  saveAddress(): void {
    this.isEditMode.set(false);
    this.addressForm.disable();
  }

  cancelEdit(): void {
    this.isEditMode.set(false);
    this.addressForm.disable();
  }
}
