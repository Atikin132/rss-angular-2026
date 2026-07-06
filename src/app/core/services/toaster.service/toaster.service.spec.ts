import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { ToasterService } from './toaster.service';

describe('ToasterService', () => {
  let service: ToasterService;
  let snackBarMock: {
    openFromComponent: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    snackBarMock = {
      openFromComponent: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: snackBarMock }],
    });

    service = TestBed.inject(ToasterService);
  });

  it('should open error toast component with message', () => {
    service.error('Failed to load products');

    expect(snackBarMock.openFromComponent).toHaveBeenCalledWith(ToastComponent, {
      data: {
        message: 'Failed to load products',
        type: 'error',
      },
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-toast'],
    });
  });
});
