import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Address } from '../../../../core/models/customer.model';
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

  readonly user = this.profileService.user;
  readonly addresses = computed(() => this.user()?.addresses ?? []);
  readonly firstAddress = computed(() => this.addresses()[0]);
  readonly isEditMode = signal(false);
  readonly addressForm = new FormGroup({
    streetName: new FormControl({ value: '', disabled: true }),
    city: new FormControl({ value: '', disabled: true }),
    postalCode: new FormControl({ value: '', disabled: true }),
    country: new FormControl({ value: '', disabled: true }),
    isDefaultShipping: new FormControl({
      value: false,
      disabled: true,
    }),
    isDefaultBilling: new FormControl({
      value: false,
      disabled: true,
    }),
  });

  constructor() {
    this.profileService.loadUser();

    effect(() => {
      const firstAddress = this.firstAddress();

      this.addressForm.patchValue({
        streetName: firstAddress?.streetName ?? '',
        city: firstAddress?.city ?? '',
        postalCode: firstAddress?.postalCode ?? '',
        country: firstAddress?.country ?? '',
        isDefaultShipping: this.isDefaultShipping(firstAddress),
        isDefaultBilling: this.isDefaultBilling(firstAddress),
      });
    });
  }

  protected isDefaultShipping(address?: Address): boolean {
    return !!address?.id && (this.user()?.shippingAddressIds.includes(address.id) ?? false);
  }

  protected isDefaultBilling(address?: Address): boolean {
    return !!address?.id && (this.user()?.billingAddressIds.includes(address.id) ?? false);
  }

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
