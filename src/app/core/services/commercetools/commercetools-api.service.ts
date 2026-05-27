import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private accessToken = '';

  private async getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }

    const credentials = btoa(
      `${environment.commercetools.clientId}:${environment.commercetools.clientSecret}`,
    );

    const response = await fetch(`${environment.commercetools.authUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    this.accessToken = data.access_token;

    return this.accessToken;
  }

  async request(endpoint: string) {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${environment.commercetools.apiUrl}/${environment.commercetools.projectKey}${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.json();
  }
}
