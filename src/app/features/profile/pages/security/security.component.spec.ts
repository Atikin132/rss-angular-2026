import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { ProfileService } from '../../services/profile.service';

import { SecurityComponent } from './security.component';

describe('SecurityComponent', () => {
  let profileServiceMock: {
    errorMessage: ReturnType<typeof signal<string>>;
    isPasswordSaving: ReturnType<typeof signal<boolean>>;
    isPasswordChanged: ReturnType<typeof signal<boolean>>;
    submitPasswordChange: ReturnType<typeof vi.fn>;
    resetPasswordChangedState: ReturnType<typeof vi.fn>;
  };
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;

  beforeEach(async () => {
    profileServiceMock = {
      errorMessage: signal(''),
      isPasswordSaving: signal(false),
      isPasswordChanged: signal(false),
      submitPasswordChange: vi.fn(),
      resetPasswordChangedState: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SecurityComponent],
      providers: [
        {
          provide: ProfileService,
          useValue: profileServiceMock,
        },
      ],
    })
      .overrideComponent(SecurityComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit invalid password form', () => {
    component.savePassword();

    expect(profileServiceMock.submitPasswordChange).not.toHaveBeenCalled();
    expect(component.passwordForm.touched).toBe(true);
  });

  it('should submit valid password form', () => {
    component.passwordForm.setValue({
      currentPassword: 'oldPass123',
      newPassword: 'newPass123',
      confirmPassword: 'newPass123',
    });

    component.savePassword();

    expect(profileServiceMock.submitPasswordChange).toHaveBeenCalledWith({
      currentPassword: 'oldPass123',
      newPassword: 'newPass123',
    });
  });

  it('should be invalid when passwords do not match', () => {
    component.passwordForm.setValue({
      currentPassword: 'oldPass123',
      newPassword: 'newPass123',
      confirmPassword: 'wrongPass123',
    });

    expect(component.passwordForm.invalid).toBe(true);
  });
});
