import { HttpContext, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { ToasterService } from '../services/toaster.service/toaster.service';
import { SUPPRESS_ERROR_TOAST, errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let toasterMock: {
    error: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    toasterMock = {
      error: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: ToasterService, useValue: toasterMock }],
    });
  });

  it('should show api error message', () => {
    const request = new HttpRequest('GET', '/products');
    const response = new HttpErrorResponse({
      status: 400,
      error: {
        message: 'Invalid request',
      },
    });
    const next = vi.fn(() => throwError(() => response));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(request, next).subscribe({
        error: () => undefined,
      });
    });

    expect(toasterMock.error).toHaveBeenCalledWith('Invalid request');
  });

  it('should show default message for server error', () => {
    const request = new HttpRequest('GET', '/products');
    const response = new HttpErrorResponse({ status: 500 });
    const next = vi.fn(() => throwError(() => response));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(request, next).subscribe({
        error: () => undefined,
      });
    });

    expect(toasterMock.error).toHaveBeenCalledWith('Server error. Please try again later.');
  });

  it('should not show toast for suppressed error', () => {
    const request = new HttpRequest('GET', '/products', {
      context: new HttpContext().set(SUPPRESS_ERROR_TOAST, (error) => error.status === 404),
    });
    const response = new HttpErrorResponse({ status: 404 });
    const next = vi.fn(() => throwError(() => response));
    const errorSpy = vi.fn();

    TestBed.runInInjectionContext(() => {
      errorInterceptor(request, next).subscribe({
        error: errorSpy,
      });
    });

    expect(toasterMock.error).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(response);
  });
});
