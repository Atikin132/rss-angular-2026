import { Injectable, signal } from '@angular/core';

const AUTH_KEY = 'isAuthenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isAuthenticated = signal(false);

  initAuth(): void {
    const storedValue = localStorage.getItem(AUTH_KEY);

    if (storedValue === 'true') {
      this.isAuthenticated.set(true);
    } else {
      this.isAuthenticated.set(false);
    }
  }

  login(): void {
    this.isAuthenticated.set(true);
    this.setLocalStorage(true);
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.removeLocalStorage();
  }

  private setLocalStorage(value: boolean): void {
    localStorage.setItem(AUTH_KEY, String(value));
  }

  private removeLocalStorage(): void {
    localStorage.removeItem(AUTH_KEY);
  }
}
