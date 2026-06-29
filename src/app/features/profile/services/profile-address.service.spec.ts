import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Customer } from '../../../core/models/customer.model';
import { ProfileAddressService } from './profile-address.service';
import { ProfileService } from './profile.service';

describe('ProfileAddressService', () => {
  let service: ProfileAddressService;
  let profileServiceMock: {
    user: ReturnType<typeof signal<Customer | null>>;
    errorMessage: ReturnType<typeof signal<string>>;
    updateCustomerByActions: ReturnType<typeof vi.fn>;
  };

  const customerMock: Customer = {
    id: 'customer-id',
    version: 1,
    versionModifiedAt: '',
    lastMessageSequenceNumber: 1,
    createdAt: '',
    lastModifiedAt: '',
    lastModifiedBy: {
      isPlatformClient: true,
      user: {
        typeId: 'user',
        id: 'user-id',
      },
    },
    createdBy: {
      clientId: 'client-id',
      isPlatformClient: true,
    },
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-15',
    password: '',
    addresses: [
      {
        id: 'address-id',
        externalId: 'profile-address-123',
      },
    ],
    shippingAddressIds: [],
    billingAddressIds: [],
    isEmailVerified: true,
    customerGroupAssignments: [],
    stores: [],
    authenticationMode: 'Password',
  };

  beforeEach(() => {
    profileServiceMock = {
      user: signal<Customer | null>(customerMock),
      errorMessage: signal(''),
      updateCustomerByActions: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProfileAddressService,
        {
          provide: ProfileService,
          useValue: profileServiceMock,
        },
      ],
    });

    service = TestBed.inject(ProfileAddressService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should submit address add', () => {
    profileServiceMock.updateCustomerByActions.mockReturnValue(of(customerMock));

    service.submitAddressAdd({
      streetName: 'Main Street',
      city: 'Berlin',
      postalCode: '10115',
      country: 'de',
      isDefaultShipping: false,
      isDefaultBilling: false,
    });

    expect(profileServiceMock.updateCustomerByActions).toHaveBeenCalled();
    expect(service.isAddressSaving()).toBe(false);
    expect(service.isAddressChanged()).toBe(true);
  });

  it('should submit address update', () => {
    profileServiceMock.updateCustomerByActions.mockReturnValue(of(customerMock));

    service.submitAddressUpdate({
      addressId: 'address-id',
      streetName: 'Main Street',
      city: 'Berlin',
      postalCode: '10115',
      country: 'de',
      isDefaultShipping: false,
      isDefaultBilling: false,
    });

    expect(profileServiceMock.updateCustomerByActions).toHaveBeenCalledWith(
      [
        {
          action: 'changeAddress',
          addressId: 'address-id',
          address: {
            streetName: 'Main Street',
            city: 'Berlin',
            postalCode: '10115',
            country: 'DE',
          },
        },
      ],
      'Failed to update address',
    );
  });

  it('should submit address remove', () => {
    profileServiceMock.updateCustomerByActions.mockReturnValue(of(customerMock));

    service.submitAddressRemove('address-id');

    expect(profileServiceMock.updateCustomerByActions).toHaveBeenCalledWith(
      [
        {
          action: 'removeAddress',
          addressId: 'address-id',
        },
      ],
      'Failed to remove address',
    );
  });

  it('should submit default address update', () => {
    profileServiceMock.updateCustomerByActions.mockReturnValue(of(customerMock));

    service.submitAddressDefaults('address-id', true, false);

    expect(profileServiceMock.updateCustomerByActions).toHaveBeenCalledWith(
      [
        {
          action: 'setDefaultShippingAddress',
          addressId: 'address-id',
        },
      ],
      'Failed to update default address',
    );
  });

  it('should not submit while address is saving', () => {
    service.isAddressSaving.set(true);

    service.submitAddressRemove('address-id');

    expect(profileServiceMock.updateCustomerByActions).not.toHaveBeenCalled();
  });

  it('should reset saving state when request fails', () => {
    profileServiceMock.updateCustomerByActions.mockReturnValue(
      throwError(() => new Error('Request failed')),
    );

    service.submitAddressRemove('address-id');

    expect(service.isAddressSaving()).toBe(false);
    expect(service.isAddressChanged()).toBe(false);
  });
});
