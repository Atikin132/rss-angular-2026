import { inject, Injectable, signal } from '@angular/core';
import { Observable, finalize, of, switchMap, take } from 'rxjs';
import { Customer } from '../../../core/models/customer.model';
import { AddAddressRequest, UpdateAddressRequest } from '../models/address-request.models';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileAddressService {
  private readonly profileService = inject(ProfileService);

  readonly isAddressSaving = signal(false);
  readonly isAddressChanged = signal(false);

  addAddress(data: AddAddressRequest): Observable<Customer> {
    const externalId = `profile-address-${Date.now()}`;

    return this.profileService
      .updateCustomerByActions(
        [
          {
            action: 'addAddress',
            address: {
              streetName: data.streetName,
              city: data.city,
              postalCode: data.postalCode,
              country: data.country.toUpperCase(),
              externalId,
            },
          },
        ],
        'Failed to add address',
      )
      .pipe(
        switchMap((updatedCustomer) => {
          const address = updatedCustomer.addresses.find((item) => item.externalId === externalId);
          const defaultActions = this.getSetDefaultAddressActions(address?.id, data);

          if (!defaultActions.length) {
            return of(updatedCustomer);
          }

          return this.profileService.updateCustomerByActions(
            defaultActions,
            'Failed to set default address',
          );
        }),
      );
  }

  updateAddress(data: UpdateAddressRequest): Observable<Customer> {
    const currentUser = this.profileService.user();
    const isCurrentlyDefaultShipping = currentUser?.defaultShippingAddressId === data.addressId;
    const isCurrentlyDefaultBilling = currentUser?.defaultBillingAddressId === data.addressId;

    return this.profileService.updateCustomerByActions(
      [
        {
          action: 'changeAddress',
          addressId: data.addressId,
          address: {
            streetName: data.streetName,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country.toUpperCase(),
          },
        },
        ...this.getSetDefaultAddressActions(data.addressId, data, {
          isCurrentlyDefaultShipping,
          isCurrentlyDefaultBilling,
        }),
      ],
      'Failed to update address',
    );
  }

  removeAddress(addressId: string): Observable<Customer> {
    return this.profileService.updateCustomerByActions(
      [
        {
          action: 'removeAddress',
          addressId,
        },
      ],
      'Failed to remove address',
    );
  }

  setAddressDefaults(
    addressId: string,
    isDefaultShipping: boolean,
    isDefaultBilling: boolean,
  ): Observable<Customer> {
    const currentUser = this.profileService.user();
    const isCurrentlyDefaultShipping = currentUser?.defaultShippingAddressId === addressId;
    const isCurrentlyDefaultBilling = currentUser?.defaultBillingAddressId === addressId;

    return this.profileService.updateCustomerByActions(
      this.getSetDefaultAddressActions(
        addressId,
        {
          isDefaultShipping,
          isDefaultBilling,
        },
        {
          isCurrentlyDefaultShipping,
          isCurrentlyDefaultBilling,
        },
      ),
      'Failed to update default address',
    );
  }

  submitAddressAdd(data: AddAddressRequest): void {
    this.submitAddressChange(() => this.addAddress(data));
  }

  submitAddressUpdate(data: UpdateAddressRequest): void {
    this.submitAddressChange(() => this.updateAddress(data));
  }

  submitAddressRemove(addressId: string): void {
    this.submitAddressChange(() => this.removeAddress(addressId));
  }

  submitAddressDefaults(
    addressId: string,
    isDefaultShipping: boolean,
    isDefaultBilling: boolean,
  ): void {
    this.submitAddressChange(() =>
      this.setAddressDefaults(addressId, isDefaultShipping, isDefaultBilling),
    );
  }

  resetAddressChangedState(): void {
    this.isAddressChanged.set(false);
  }

  private submitAddressChange(request: () => Observable<Customer>): void {
    if (this.isAddressSaving()) return;

    this.isAddressSaving.set(true);
    this.isAddressChanged.set(false);
    this.profileService.errorMessage.set('');

    request()
      .pipe(
        take(1),
        finalize(() => {
          this.isAddressSaving.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.isAddressChanged.set(true);
        },
        error: () => undefined,
      });
  }

  private getSetDefaultAddressActions(
    addressId: string | undefined,
    data: Pick<AddAddressRequest, 'isDefaultShipping' | 'isDefaultBilling'>,
    currentState: {
      isCurrentlyDefaultShipping?: boolean;
      isCurrentlyDefaultBilling?: boolean;
    } = {},
  ): unknown[] {
    if (!addressId) {
      return [];
    }

    const actions: unknown[] = [];

    if (data.isDefaultShipping || currentState.isCurrentlyDefaultShipping) {
      const action: { action: string; addressId?: string } = {
        action: 'setDefaultShippingAddress',
      };

      if (data.isDefaultShipping) {
        action.addressId = addressId;
      }

      actions.push(action);
    }

    if (data.isDefaultBilling || currentState.isCurrentlyDefaultBilling) {
      const action: { action: string; addressId?: string } = {
        action: 'setDefaultBillingAddress',
      };

      if (data.isDefaultBilling) {
        action.addressId = addressId;
      }

      actions.push(action);
    }

    return actions;
  }
}
