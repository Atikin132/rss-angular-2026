import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { RegisterFormValue } from '../../models/forms/register-form-value.model';
import { AuthService } from '../../services/auth.service';
import { mapRegisterFormToRequests } from '../../mappers/register.mapper';
import { MatCheckboxModule } from '@angular/material/checkbox';

const namePattern = /^[\p{L}\s'-]+$/u;

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  protected readonly errorMessage = signal('');

  protected readonly isPasswordVisible = signal(false);
  protected readonly isConfirmPasswordVisible = signal(false);

  ngOnInit(): void {
    const shipping = this.addressForm.controls.shippingAddress;
    const billing = this.addressForm.controls.billingAddress;

    shipping.controls.country.valueChanges.subscribe(() => {
      shipping.controls.postalCode.updateValueAndValidity();
    });
    billing.controls.country.valueChanges.subscribe(() => {
      billing.controls.postalCode.updateValueAndValidity();
    });

    this.addressForm.controls.useSeparateAddresses.valueChanges.subscribe((useSeparate) => {
      const billing = this.addressForm.controls.billingAddress;

      if (useSeparate) {
        billing.controls.street.addValidators(Validators.required);
        billing.controls.city.addValidators([Validators.required, Validators.pattern(namePattern)]);
        billing.controls.country.addValidators(Validators.required);
        billing.controls.postalCode.addValidators([Validators.required, this.postalCodeValidator]);
      } else {
        billing.controls.street.clearValidators();
        billing.controls.city.clearValidators();
        billing.controls.country.clearValidators();
        billing.controls.postalCode.clearValidators();

        billing.reset({
          street: '',
          city: '',
          postalCode: '',
          country: '',
        });
      }

      Object.values(billing.controls).forEach((control) => {
        control.updateValueAndValidity();
      });
    });
  }

  protected readonly countries = [
    { code: 'US', label: 'United States' },
    { code: 'DE', label: 'Germany' },
    { code: 'FR', label: 'France' },
    { code: 'PL', label: 'Poland' },
    { code: 'GB', label: 'United Kingdom' },
    { code: 'BY', label: 'Belarus' },
    { code: 'RU', label: 'Russia' },
  ];

  private postalCodePatterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    PL: /^\d{2}-\d{3}$/,
    GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
    BY: /^\d{6}$/,
    RU: /^\d{6}$/,
  };

  private adultValidator: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    if (!value) return null;
    const today = new Date();
    const birthDate = new Date(value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 ? null : { tooYoung: true };
  };

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) return null;
    const isEqual = password.value === confirmPassword.value;
    if (isEqual) {
      confirmPassword.setErrors(null);
      return null;
    }
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  };

  private postalCodeValidator: ValidatorFn = (control: AbstractControl) => {
    const country = control.parent?.get('country')?.value;
    const value = control.value;
    if (!country || !value) return null;
    const pattern = this.postalCodePatterns[country];
    if (!pattern) return null;
    return pattern.test(value) ? null : { invalidPostalCode: true };
  };

  protected readonly accountForm = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.pattern(namePattern)]],
      lastName: ['', [Validators.required, Validators.pattern(namePattern)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
        ],
      ],
      dateOfBirth: [null as Date | null, [Validators.required, this.adultValidator]],
    },
    {
      validators: [this.passwordMatchValidator],
      updateOn: 'change',
    },
  );

  protected readonly addressForm = this.fb.nonNullable.group({
    useSeparateAddresses: [false],
    shippingAddress: this.fb.nonNullable.group({
      street: ['', Validators.required],
      city: ['', [Validators.required, Validators.pattern(namePattern)]],
      postalCode: ['', [Validators.required, this.postalCodeValidator]],
      country: ['', Validators.required],
    }),
    billingAddress: this.fb.nonNullable.group({
      street: [''],
      city: [''],
      postalCode: [''],
      country: [''],
    }),
  });

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((v) => !v);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible.update((v) => !v);
  }

  protected async submit(): Promise<void> {
    if (this.accountForm.invalid || this.addressForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.addressForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');

    try {
      const formValue: RegisterFormValue = {
        ...this.accountForm.getRawValue(),
        ...this.addressForm.getRawValue(),
      };

      const requests = mapRegisterFormToRequests(formValue);

      await this.authService.register(requests);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Registration failed. Please try again.',
      );
    }
  }
}
