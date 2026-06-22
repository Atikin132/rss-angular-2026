import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordControlName = 'password',
  confirmPasswordControlName = 'confirmPassword',
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordControlName);
    const confirmPassword = control.get(confirmPasswordControlName);

    if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };
}
