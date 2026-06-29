import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { Customer } from '../../../../core/models/customer.model';
import { ProfileAddressService } from '../../services/profile-address.service';
import { ProfileService } from '../../services/profile.service';

import { AddressesComponent } from './addresses.component';

describe('AddressesComponent', () => {
  let profileServiceMock: {
    user: ReturnType<typeof signal<Customer | null>>;
    errorMessage: ReturnType<typeof signal<string>>;
    loadUser: ReturnType<typeof vi.fn>;
  };
  let profileAddressServiceMock: {
    isAddressSaving: ReturnType<typeof signal<boolean>>;
    isAddressChanged: ReturnType<typeof signal<boolean>>;
    submitAddressAdd: ReturnType<typeof vi.fn>;
    submitAddressUpdate: ReturnType<typeof vi.fn>;
    submitAddressRemove: ReturnType<typeof vi.fn>;
    submitAddressDefaults: ReturnType<typeof vi.fn>;
    resetAddressChangedState: ReturnType<typeof vi.fn>;
  };
  let component: AddressesComponent;
  let fixture: ComponentFixture<AddressesComponent>;

  beforeEach(async () => {
    profileServiceMock = {
      user: signal<Customer | null>(null),
      errorMessage: signal(''),
      loadUser: vi.fn(),
    };
    profileAddressServiceMock = {
      isAddressSaving: signal(false),
      isAddressChanged: signal(false),
      submitAddressAdd: vi.fn(),
      submitAddressUpdate: vi.fn(),
      submitAddressRemove: vi.fn(),
      submitAddressDefaults: vi.fn(),
      resetAddressChangedState: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AddressesComponent],
      providers: [
        {
          provide: ProfileService,
          useValue: profileServiceMock,
        },
        {
          provide: ProfileAddressService,
          useValue: profileAddressServiceMock,
        },
      ],
    })
      .overrideComponent(AddressesComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AddressesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    expect(profileServiceMock.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should open add address form', () => {
    component.addAddress();

    expect(component.formMode()).toBe('add');
    expect(component.selectedAddressId()).toBe(null);
    expect(component.addressForm.enabled).toBe(true);
  });

  it('should not submit invalid address form', () => {
    component.addAddress();

    component.saveAddress();

    expect(profileAddressServiceMock.submitAddressAdd).not.toHaveBeenCalled();
    expect(component.addressForm.touched).toBe(true);
  });

  it('should submit new address', () => {
    component.addAddress();
    component.addressForm.setValue({
      streetName: 'Main Street',
      city: 'Berlin',
      postalCode: '10115',
      country: 'DE',
      isDefaultShipping: true,
      isDefaultBilling: false,
    });

    component.saveAddress();

    expect(profileAddressServiceMock.submitAddressAdd).toHaveBeenCalledWith({
      streetName: 'Main Street',
      city: 'Berlin',
      postalCode: '10115',
      country: 'DE',
      isDefaultShipping: true,
      isDefaultBilling: false,
    });
  });

  it('should remove address by id', () => {
    component.removeAddress({ id: 'address-id' });

    expect(profileAddressServiceMock.submitAddressRemove).toHaveBeenCalledWith('address-id');
  });

  it('should not remove address without id', () => {
    component.removeAddress({});

    expect(profileAddressServiceMock.submitAddressRemove).not.toHaveBeenCalled();
  });

  it('should cancel address editing', () => {
    component.addAddress();

    component.cancelEdit();

    expect(component.formMode()).toBe(null);
    expect(component.selectedAddressId()).toBe(null);
  });
});
