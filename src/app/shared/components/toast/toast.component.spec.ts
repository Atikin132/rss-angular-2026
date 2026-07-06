import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

import { ToastComponent, ToastData } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let snackBarRefMock: {
    dismiss: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    snackBarRefMock = {
      dismiss: vi.fn(),
    };

    const data: ToastData = {
      message: 'Something went wrong',
      type: 'error',
    };

    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: data },
        { provide: MatSnackBarRef, useValue: snackBarRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render message', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Something went wrong');
  });

  it('should dismiss snackbar on close', () => {
    component.close();

    expect(snackBarRefMock.dismiss).toHaveBeenCalledTimes(1);
  });
});
