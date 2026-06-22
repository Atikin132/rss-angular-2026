import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AuthResponse } from './commercetools.types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  private accessToken = '';
  private expiresAt = 0;

  private tokenPromise?: Promise<string>;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    this.tokenPromise = this.fetchAccessToken();

    try {
      return await this.tokenPromise;
    } finally {
      this.tokenPromise = undefined;
    }
  }

  private async fetchAccessToken(): Promise<string> {
    const credentials = btoa(
      `${environment.commercetools.clientId}:${environment.commercetools.clientSecret}`,
    );

    const body = new HttpParams().set('grant_type', 'client_credentials');

    const response = await firstValueFrom(
      this.http.post<AuthResponse>(
        `${environment.commercetools.authUrl}/oauth/token`,
        body.toString(),
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    this.accessToken = response.access_token;

    this.expiresAt = Date.now() + (response.expires_in - 60) * 1000;

    return this.accessToken;
  }

  async request<T>(endpoint: string): Promise<T> {
    const token = await this.getAccessToken();

    return firstValueFrom(
      this.http.get<T>(
        `${environment.commercetools.apiUrl}/${environment.commercetools.projectKey}${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
  }
  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const token = await this.getAccessToken();
    return firstValueFrom(
      this.http.post<T>(
        `${environment.commercetools.apiUrl}/${environment.commercetools.projectKey}${endpoint}`,

        body,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
  }
}
