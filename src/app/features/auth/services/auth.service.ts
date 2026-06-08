import { Injectable, signal } from '@angular/core';

const AUTH_KEY = 'isAuthenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isAuthenticated = signal(false);

  initAuth(): void {
    const localValue = localStorage.getItem(AUTH_KEY);
    const sessionValue = sessionStorage.getItem(AUTH_KEY);

    this.isAuthenticated.set(localValue === 'true' || sessionValue === 'true');
  }

  login(rememberMe = false): void {
    this.isAuthenticated.set(true);

    if (rememberMe) {
      localStorage.setItem(AUTH_KEY, 'true');
    } else {
      sessionStorage.setItem(AUTH_KEY, 'true');
    }
  }

  logout(): void {
    this.isAuthenticated.set(false);

    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  }
}
