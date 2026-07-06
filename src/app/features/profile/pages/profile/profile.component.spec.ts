import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { Customer } from '../../../../core/models/customer.model';
import { ProfileService } from '../../services/profile.service';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let profileServiceMock: {
    user: ReturnType<typeof signal<Customer | null>>;
    errorMessage: ReturnType<typeof signal<string>>;
    isProfileSaving: ReturnType<typeof signal<boolean>>;
    isProfileUpdated: ReturnType<typeof signal<boolean>>;
    loadUser: ReturnType<typeof vi.fn>;
    submitProfileUpdate: ReturnType<typeof vi.fn>;
    resetProfileUpdatedState: ReturnType<typeof vi.fn>;
  };
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

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
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1995-06-20',
    password: '',
    addresses: [],
    shippingAddressIds: [],
    billingAddressIds: [],
    isEmailVerified: true,
    customerGroupAssignments: [],
    stores: [],
    authenticationMode: 'Password',
  };

  beforeEach(async () => {
    profileServiceMock = {
      user: signal<Customer | null>(null),
      errorMessage: signal(''),
      isProfileSaving: signal(false),
      isProfileUpdated: signal(false),
      loadUser: vi.fn(),
      submitProfileUpdate: vi.fn(),
      resetProfileUpdatedState: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: ProfileService,
          useValue: profileServiceMock,
        },
      ],
    })
      .overrideComponent(ProfileComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    expect(profileServiceMock.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should keep profile form disabled before editing', () => {
    expect(component.isEditMode()).toBe(false);
    expect(component.profileForm.disabled).toBe(true);
  });

  it('should patch form when user is loaded', async () => {
    profileServiceMock.user.set(customerMock);
    await fixture.whenStable();

    expect(component.profileForm.getRawValue()).toEqual({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      dateOfBirth: new Date('1995-06-20'),
    });
  });

  it('should enable form after edit profile', () => {
    component.editProfile();

    expect(component.profileForm.enabled).toBe(true);
    expect(component.isEditMode()).toBe(true);
  });

  it('should not submit invalid profile form', () => {
    component.editProfile();
    component.profileForm.patchValue({
      firstName: '',
      lastName: 'Doe',
      email: 'wrong-email',
      dateOfBirth: new Date('1990-01-01'),
    });

    component.saveProfile();

    expect(profileServiceMock.submitProfileUpdate).not.toHaveBeenCalled();
    expect(component.profileForm.touched).toBe(true);
  });

  it('should submit valid profile form', () => {
    component.editProfile();
    component.profileForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      dateOfBirth: new Date(1990, 0, 15),
    });

    component.saveProfile();

    expect(profileServiceMock.submitProfileUpdate).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      dateOfBirth: '1990-01-15',
    });
  });

  it('should cancel editing and disable form', () => {
    component.editProfile();

    component.cancelEdit();

    expect(component.isEditMode()).toBe(false);
    expect(component.profileForm.disabled).toBe(true);
  });
});
