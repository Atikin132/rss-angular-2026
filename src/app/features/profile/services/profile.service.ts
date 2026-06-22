import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Customer } from '../../../core/models/customer.model';
import { catchError, defer, finalize, Observable, take, tap, throwError } from 'rxjs';
import { CustomerService } from '../../auth/services/customer.service';
import { ChangePasswordRequest, UpdateProfileRequest } from '../models/profile-request.models';
import { getCustomerToken } from '../../../shared/utils/customer-token';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly customerService = inject(CustomerService);
  private readonly baseUrl = `${environment.commercetools.apiUrl}/${environment.commercetools.projectKey}/me`;
  private isLoading = false;

  readonly user = signal<Customer | null>(null);
  readonly errorMessage = signal('');
  readonly isProfileSaving = signal(false);
  readonly isProfileUpdated = signal(false);
  readonly isPasswordSaving = signal(false);
  readonly isPasswordChanged = signal(false);

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message ?? error.error?.error_description ?? fallback;
    }

    return error instanceof Error ? error.message : fallback;
  }

  updateCustomerByActions(actions: unknown[], fallbackErrorMessage: string): Observable<Customer> {
    return defer(() => {
      const customer = this.user();

      if (!customer) {
        throw new Error('Customer profile is not loaded');
      }

      const token = getCustomerToken('manage_my_profile');

      return this.http.post<Customer>(
        this.baseUrl,
        {
          version: customer.version,
          actions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }).pipe(
      tap((updatedCustomer) => {
        this.errorMessage.set('');
        this.user.set(updatedCustomer);
        this.customerService.setUser(updatedCustomer);
      }),
      catchError((error: unknown) => {
        this.errorMessage.set(this.getErrorMessage(error, fallbackErrorMessage));
        return throwError(() => error);
      }),
    );
  }

  getUserProfile(): Observable<Customer> {
    return defer(() => {
      const token = getCustomerToken('manage_my_profile');

      return this.http.get<Customer>(this.baseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }).pipe(
      tap((customer) => {
        this.user.set(customer);
        this.customerService.setUser(customer);
      }),
    );
  }

  updateUserProfile(data: UpdateProfileRequest): Observable<Customer> {
    return this.updateCustomerByActions(
      [
        {
          action: 'setFirstName',
          firstName: data.firstName,
        },
        {
          action: 'setLastName',
          lastName: data.lastName,
        },
        {
          action: 'changeEmail',
          email: data.email,
        },
        {
          action: 'setDateOfBirth',
          dateOfBirth: data.dateOfBirth,
        },
      ],
      'Failed to update user profile',
    );
  }

  submitProfileUpdate(data: UpdateProfileRequest): void {
    if (this.isProfileSaving()) return;

    this.isProfileSaving.set(true);
    this.isProfileUpdated.set(false);
    this.errorMessage.set('');

    this.updateUserProfile(data)
      .pipe(
        take(1),
        finalize(() => {
          this.isProfileSaving.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.isProfileUpdated.set(true);
        },
        error: () => undefined,
      });
  }

  resetProfileUpdatedState(): void {
    this.isProfileUpdated.set(false);
  }

  loadUser(): void {
    if (this.user() || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage.set('');

    this.getUserProfile()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => undefined,
        error: (error) => {
          this.errorMessage.set(
            error instanceof Error ? error.message : 'Failed to load user profile',
          );
        },
      });
  }

  changePassword(data: ChangePasswordRequest): Observable<Customer> {
    return defer(() => {
      const customer = this.user();

      if (!customer) {
        throw new Error('Customer profile is not loaded');
      }

      const token = getCustomerToken('manage_my_profile');

      return this.http.post<Customer>(
        `${this.baseUrl}/password`,
        {
          version: customer.version,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }).pipe(
      tap((updatedCustomer) => {
        this.errorMessage.set('');
        this.user.set(updatedCustomer);
        this.customerService.setUser(updatedCustomer);
      }),
      catchError((error: unknown) => {
        this.errorMessage.set(this.getErrorMessage(error, 'Failed to update password'));
        return throwError(() => error);
      }),
    );
  }

  submitPasswordChange(data: ChangePasswordRequest): void {
    if (this.isPasswordSaving()) return;

    this.isPasswordSaving.set(true);
    this.isPasswordChanged.set(false);
    this.errorMessage.set('');

    this.changePassword(data)
      .pipe(
        take(1),
        finalize(() => {
          this.isPasswordSaving.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.isPasswordChanged.set(true);
        },
        error: () => undefined,
      });
  }

  resetPasswordChangedState(): void {
    this.isPasswordChanged.set(false);
  }
}
