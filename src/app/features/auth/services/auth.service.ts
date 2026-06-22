import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from '../../../core/services/commercetools/commercetools-api.service';
import { RegisterRequests } from '../models/api/register-request.model';
import { Customer } from '../../../core/models/customer.model';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { LoginResponse } from '../models/api/login-response.model';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { CustomerService } from './customer.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const EXPIRES_AT_KEY = 'expiresAt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isAuthenticated = signal(false);
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  private showWarning(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 7000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  private findAddressId(customer: Customer, externalId: string): string {
    const address = customer.addresses.find((a) => a.externalId === externalId);

    if (!address?.id) {
      throw new Error(`Address with externalId "${externalId}" not found`);
    }

    return address.id;
  }

  initAuth(): void {
    const accessToken =
      localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken');

    const expiresAt = localStorage.getItem('expiresAt') ?? sessionStorage.getItem('expiresAt');

    this.isAuthenticated.set(!!accessToken && !!expiresAt && Date.now() < Number(expiresAt));
  }

  async register(data: RegisterRequests): Promise<Customer> {
    try {
      const response = await this.api.post<{ customer: Customer }>('/customers', data.account);

      return response.customer;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new Error(error.error?.message ?? 'Registration failed. Please try again.', {
          cause: error,
        });
      }

      throw error;
    }
  }

  async setDateOfBirthAndAddAddress(data: RegisterRequests, customer: Customer): Promise<Customer> {
    const actions = [
      {
        action: 'setDateOfBirth',
        ...data.dateOfBirth,
      },
      {
        action: 'addAddress',
        address: {
          ...data.shippingAddress,
          externalId: 'shipping',
        },
      },
    ];

    if (data.useSeparateAddresses && data.billingAddress) {
      actions.push({
        action: 'addAddress',
        address: {
          ...data.billingAddress,
          externalId: 'billing',
        },
      });
    }
    const updateInfoBody = {
      version: customer.version,
      actions,
    };

    const response = await this.api.post<Customer>(`/customers/${customer.id}`, updateInfoBody);
    return response;
  }

  async assignShippingAndBillingAddresses(
    data: RegisterRequests,
    customer: Customer,
  ): Promise<Customer> {
    const addressActions = [];
    addressActions.push({
      action: 'addShippingAddressId',

      addressId: this.findAddressId(customer, 'shipping'),
    });

    if (data.useSeparateAddresses) {
      addressActions.push({
        action: 'addBillingAddressId',
        addressId: this.findAddressId(customer, 'billing'),
      });
    } else {
      addressActions.push({
        action: 'addBillingAddressId',
        addressId: this.findAddressId(customer, 'shipping'),
      });
    }

    const response = await this.api.post<Customer>(`/customers/${customer.id}`, {
      version: customer.version,
      actions: addressActions,
    });

    return response;
  }

  async registerAndInitializeProfile(data: RegisterRequests): Promise<void> {
    const customerAfterCreate = await this.register(data);

    try {
      const customerAfterUpdate = await this.setDateOfBirthAndAddAddress(data, customerAfterCreate);
      await this.assignShippingAndBillingAddresses(data, customerAfterUpdate);
    } catch {
      this.showWarning(
        'Account created successfully. Automatic login failed. Please sign in manually.',
      );
    }

    try {
      await this.login(data.account.email, data.account.password, false);
    } catch {
      await this.router.navigate(['/login']);
      this.showWarning('Account created, but Login failed. Please try again.');
    }
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<LoginResponse> {
    try {
      const storage = rememberMe ? localStorage : sessionStorage;

      const credentials = btoa(
        `${environment.commercetools.clientId}:${environment.commercetools.clientSecret}`,
      );

      const body = new HttpParams()
        .set('grant_type', 'password')
        .set('username', email)
        .set('password', password);

      const response = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${environment.commercetools.authUrl}/oauth/${environment.commercetools.projectKey}/customers/token`,
          body.toString(),
          {
            headers: {
              Authorization: `Basic ${credentials}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      storage.setItem(ACCESS_TOKEN_KEY, response.access_token);
      storage.setItem(REFRESH_TOKEN_KEY, response.refresh_token || '');
      storage.setItem(EXPIRES_AT_KEY, String(Date.now() + response.expires_in * 1000));

      this.isAuthenticated.set(true);

      const customerId = response.scope
        .split(' ')
        .find((s) => s.startsWith('customer_id:'))
        ?.replace('customer_id:', '');

      if (customerId) {
        const customer = await this.api.request<Customer>(`/customers/${customerId}`);
        this.customerService.setUser(customer);
      }

      await this.router.navigate(['/']);

      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new Error(
          error.error?.error_description ??
            error.error?.message ??
            'Login failed. Please check your credentials.',
          {
            cause: error,
          },
        );
      }

      throw error;
    }
  }

  logout(): void {
    if (!this.isAuthenticated()) return;

    this.isAuthenticated.set(false);
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
