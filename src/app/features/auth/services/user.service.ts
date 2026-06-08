import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly user = signal<User | null>(null);

  readonly fullName = computed(() => {
    const u = this.user();
    return u ? `${u.firstName} ${u.lastName}` : 'User';
  });

  setUser(user: User): void {
    this.user.set(user);
  }

  clearUser(): void {
    this.user.set(null);
  }
}
