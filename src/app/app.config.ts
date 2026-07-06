import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
  importProvidersFrom,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { PRICE_FORMAT_OPTIONS } from './shared/tokens/price-format-options';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { errorInterceptor } from './core/interceptors/error.interceptor';

import { routes } from './app.routes';
import { AuthService } from './features/auth/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(MatSnackBarModule),

    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.initAuth();
    }),
    {
      provide: PRICE_FORMAT_OPTIONS,
      useValue: {
        currencyCode: 'USD',
        locale: 'en-US',
      },
    },
  ],
};
