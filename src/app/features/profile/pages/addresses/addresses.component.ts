import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Address } from '../../../../core/models/customer.model';
import { ProfileAddressService } from '../../services/profile-address.service';
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
  private readonly profileAddressService = inject(ProfileAddressService);

  readonly user = this.profileService.user;
  readonly addresses = computed(() => this.user()?.addresses ?? []);
  readonly errorMessage = this.profileService.errorMessage;
  readonly isAddressSaving = this.profileAddressService.isAddressSaving;
  readonly formMode = signal<'add' | 'edit' | null>(null);
  readonly selectedAddressId = signal<string | null>(null);
  readonly isFormOpen = computed(() => this.formMode() !== null);
  readonly addressForm = new FormGroup({
    streetName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    city: new FormControl({ value: '', disabled: true }, [Validators.required]),
    postalCode: new FormControl({ value: '', disabled: true }, [Validators.required]),
    country: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.pattern(/^[A-Za-z]{2}$/),
    ]),
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
      if (!this.profileAddressService.isAddressChanged()) return;

      this.addressForm.reset();
      this.addressForm.disable();
      this.formMode.set(null);
      this.selectedAddressId.set(null);
      this.profileAddressService.resetAddressChangedState();
    });
  }

  protected isDefaultShipping(address?: Address): boolean {
    if (!address?.id) return false;

    const user = this.user();

    return (
      user?.defaultShippingAddressId === address.id ||
      (!user?.defaultShippingAddressId && (user?.shippingAddressIds.includes(address.id) ?? false))
    );
  }

  protected isDefaultBilling(address?: Address): boolean {
    if (!address?.id) return false;

    const user = this.user();

    return (
      user?.defaultBillingAddressId === address.id ||
      (!user?.defaultBillingAddressId && (user?.billingAddressIds.includes(address.id) ?? false))
    );
  }

  addAddress(): void {
    this.formMode.set('add');
    this.selectedAddressId.set(null);
    this.addressForm.reset({
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
    this.addressForm.enable();
  }

  editAddress(address: Address): void {
    if (!address.id) return;

    this.formMode.set('edit');
    this.selectedAddressId.set(address.id);
    this.addressForm.reset({
      streetName: address.streetName ?? '',
      city: address.city ?? '',
      postalCode: address.postalCode ?? '',
      country: address.country ?? '',
      isDefaultShipping: this.isDefaultShipping(address),
      isDefaultBilling: this.isDefaultBilling(address),
    });
    this.addressForm.enable();
  }

  saveAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const { streetName, city, postalCode, country, isDefaultShipping, isDefaultBilling } =
      this.addressForm.getRawValue();

    if (!streetName || !city || !postalCode || !country) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const payload = {
      streetName,
      city,
      postalCode,
      country,
      isDefaultShipping: !!isDefaultShipping,
      isDefaultBilling: !!isDefaultBilling,
    };

    if (this.formMode() === 'edit') {
      const addressId = this.selectedAddressId();

      if (!addressId) return;

      this.profileAddressService.submitAddressUpdate({
        addressId,
        ...payload,
      });
      return;
    }

    this.profileAddressService.submitAddressAdd(payload);
  }

  removeAddress(address: Address): void {
    if (!address.id) return;

    this.profileAddressService.submitAddressRemove(address.id);
  }

  setDefaultShipping(address: Address): void {
    if (!address.id) return;

    this.profileAddressService.submitAddressDefaults(
      address.id,
      true,
      this.isDefaultBilling(address),
    );
  }

  setDefaultBilling(address: Address): void {
    if (!address.id) return;

    this.profileAddressService.submitAddressDefaults(
      address.id,
      this.isDefaultShipping(address),
      true,
    );
  }

  cancelEdit(): void {
    this.formMode.set(null);
    this.selectedAddressId.set(null);
    this.addressForm.reset();
    this.addressForm.disable();
  }
}
