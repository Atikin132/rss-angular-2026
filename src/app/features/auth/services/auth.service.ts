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

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const EXPIRES_AT_KEY = 'expiresAt';
const SCOPE_KEY = 'scope';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isAuthenticated = signal(false);
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

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

  async register(data: RegisterRequests): Promise<void> {
    try {
      const createResponse = await this.api.post<{ customer: Customer }>(
        '/customers',
        data.account,
      );

      const customerAfterCreate = createResponse.customer;

      const actions = [
        {
          action: 'setDateOfBirth',
          ...data.dateOfBirth,
        },
        {
          action: 'addAddress',
          address: {
            ...data.shippingAddress,
            externalId: data.useSeparateAddresses ? 'shipping' : 'shipping-billing',
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
        version: customerAfterCreate.version,
        actions,
      };

      const updateResponse = await this.api.post<Customer>(
        `/customers/${customerAfterCreate.id}`,
        updateInfoBody,
      );

      const updatedCustomer = updateResponse;

      const addressActions = [];
      addressActions.push({
        action: 'addShippingAddressId',

        addressId: this.findAddressId(updatedCustomer, 'shipping'),
      });

      if (data.useSeparateAddresses) {
        addressActions.push({
          action: 'addBillingAddressId',

          addressId: this.findAddressId(updatedCustomer, 'billing'),
        });
      } else {
        addressActions.push({
          action: 'addBillingAddressId',

          addressId: this.findAddressId(updatedCustomer, 'shipping'),
        });
      }

      await this.api.post(`/customers/${updatedCustomer.id}`, {
        version: updatedCustomer.version,

        actions: addressActions,
      });
      await this.login(data.account.email, data.account.password, false);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new Error(error.error?.message ?? 'Registration failed. Please try again.', {
          cause: error,
        });
      }

      throw error;
    }
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<LoginResponse> {
    try {
      const storage = rememberMe ? localStorage : sessionStorage;

      const credentials = btoa(
        `${environment.commercetools.spaClientId}:${environment.commercetools.spaClientSecret}`,
      );

      const baseBody = new HttpParams()
        .set('grant_type', 'password')
        .set('username', email)
        .set('password', password);

      const scopedBody = baseBody.set(
        'scope',
        [
          `manage_my_profile:${environment.commercetools.projectKey}`,
          `manage_my_orders:${environment.commercetools.projectKey}`,
        ].join(' '),
      );

      const tokenUrl = `${environment.commercetools.authUrl}/oauth/${environment.commercetools.projectKey}/customers/token`;
      const tokenRequestOptions = {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      let response: LoginResponse;

      try {
        response = await firstValueFrom(
          this.http.post<LoginResponse>(tokenUrl, scopedBody.toString(), tokenRequestOptions),
        );
      } catch (error) {
        const scopeError =
          error instanceof HttpErrorResponse &&
          (error.error?.error === 'invalid_scope' ||
            String(error.error?.error_description ?? error.error?.message ?? '')
              .toLowerCase()
              .includes('scope'));

        if (!scopeError) {
          throw error;
        }

        response = await firstValueFrom(
          this.http.post<LoginResponse>(tokenUrl, baseBody.toString(), tokenRequestOptions),
        );
      }

      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(EXPIRES_AT_KEY);
      localStorage.removeItem(SCOPE_KEY);
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(EXPIRES_AT_KEY);
      sessionStorage.removeItem(SCOPE_KEY);

      storage.setItem(ACCESS_TOKEN_KEY, response.access_token);
      storage.setItem(REFRESH_TOKEN_KEY, response.refresh_token || '');
      storage.setItem(EXPIRES_AT_KEY, String(Date.now() + response.expires_in * 1000));
      storage.setItem(SCOPE_KEY, response.scope);

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
