import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../auth/services/customer.service';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
  };
  let customerServiceMock: {
    setUser: ReturnType<typeof vi.fn>;
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
    addresses: [],
    shippingAddressIds: [],
    billingAddressIds: [],
    isEmailVerified: true,
    customerGroupAssignments: [],
    stores: [],
    authenticationMode: 'Password',
  };

  beforeEach(() => {
    httpMock = {
      get: vi.fn(),
      post: vi.fn(),
    };
    customerServiceMock = {
      setUser: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        {
          provide: HttpClient,
          useValue: httpMock,
        },
        {
          provide: CustomerService,
          useValue: customerServiceMock,
        },
      ],
    });

    sessionStorage.setItem('accessToken', 'token');
    sessionStorage.setItem('scope', 'manage_my_profile:project customer_id:customer-id');
    service = TestBed.inject(ProfileService);
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should load user profile and store customer', () => {
    httpMock.get.mockReturnValue(of(customerMock));

    service.getUserProfile().subscribe();

    expect(service.user()).toEqual(customerMock);
    expect(customerServiceMock.setUser).toHaveBeenCalledWith(customerMock);
  });

  it('should update user profile with commercetools actions', () => {
    service.user.set(customerMock);
    httpMock.post.mockReturnValue(of(customerMock));

    service
      .updateUserProfile({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        dateOfBirth: '1995-06-20',
      })
      .subscribe();

    expect(httpMock.post).toHaveBeenCalledWith(
      expect.any(String),
      {
        version: 1,
        actions: [
          {
            action: 'setFirstName',
            firstName: 'Jane',
          },
          {
            action: 'setLastName',
            lastName: 'Smith',
          },
          {
            action: 'changeEmail',
            email: 'jane@example.com',
          },
          {
            action: 'setDateOfBirth',
            dateOfBirth: '1995-06-20',
          },
        ],
      },
      expect.any(Object),
    );
  });

  it('should submit profile update and set updated state', () => {
    service.user.set(customerMock);
    httpMock.post.mockReturnValue(of(customerMock));

    service.submitProfileUpdate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      dateOfBirth: '1990-01-15',
    });

    expect(service.isProfileSaving()).toBe(false);
    expect(service.isProfileUpdated()).toBe(true);
  });

  it('should not submit profile update while saving', () => {
    service.isProfileSaving.set(true);

    service.submitProfileUpdate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      dateOfBirth: '1990-01-15',
    });

    expect(httpMock.post).not.toHaveBeenCalled();
  });

  it('should set error message when profile update fails', () => {
    service.user.set(customerMock);
    httpMock.post.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: {
              message: 'Update failed',
            },
          }),
      ),
    );

    service.submitProfileUpdate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      dateOfBirth: '1990-01-15',
    });

    expect(service.errorMessage()).toBe('Update failed');
    expect(service.isProfileUpdated()).toBe(false);
  });

  it('should change password and set changed state', () => {
    service.user.set(customerMock);
    httpMock.post.mockReturnValue(of(customerMock));

    service.submitPasswordChange({
      currentPassword: 'oldPass123',
      newPassword: 'newPass123',
    });

    expect(service.isPasswordSaving()).toBe(false);
    expect(service.isPasswordChanged()).toBe(true);
  });
});
