import { Injectable, signal, computed } from '@angular/core';
import { Customer } from '../../../core/models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  readonly user = signal<Customer | null>(null);

  readonly fullName = computed(() => {
    const u = this.user();
    return u ? `${u.firstName} ${u.lastName}` : 'Customer';
  });

  setUser(user: Customer): void {
    this.user.set(user);
  }

  clearUser(): void {
    this.user.set(null);
  }
}
