import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ToasterService } from '../services/toaster.service/toaster.service';

export type ErrorToastSuppressor = (error: HttpErrorResponse) => boolean;

export const SUPPRESS_ERROR_TOAST = new HttpContextToken<ErrorToastSuppressor>(() => () => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToasterService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const suppressErrorToast = req.context.get(SUPPRESS_ERROR_TOAST);

        if (!suppressErrorToast(error)) {
          const message =
            error.error?.message ??
            error.error?.error_description ??
            getDefaultHttpErrorMessage(error);

          toaster.error(message);
        }
      }

      return throwError(() => error);
    }),
  );
};

function getDefaultHttpErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Network error. Please check your internet connection.';
  }

  if (error.status === 401) {
    return 'You are not authorized. Please log in again.';
  }

  if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error.status === 404) {
    return 'Requested resource was not found.';
  }

  if (error.status >= 500) {
    return 'Server error. Please try again later.';
  }

  return 'Something went wrong. Please try again.';
}
