import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Customer } from '../../../core/models/customer.model';
import { finalize, Observable, take, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.commercetools.apiUrl}/${environment.commercetools.projectKey}/me`;
  private isLoading = false;

  readonly user = signal<Customer | null>(null);
  readonly errorMessage = signal('');

  getUserProfile(): Observable<Customer> {
    const token = sessionStorage.getItem('accessToken') ?? localStorage.getItem('accessToken');
    const scope = sessionStorage.getItem('scope') ?? localStorage.getItem('scope');

    if (!token) {
      return throwError(() => new Error('Customer access token not found'));
    }

    if (!scope?.includes('manage_my_profile') || !scope.includes('customer_id:')) {
      return throwError(
        () => new Error(`Customer token has insufficient scope: ${scope ?? 'empty'}`),
      );
    }

    return this.http.get<Customer>(this.baseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
        next: (customer) => {
          this.user.set(customer);
        },
        error: (error) => {
          this.errorMessage.set(
            error instanceof Error ? error.message : 'Failed to load user profile',
          );
        },
      });
  }
}
