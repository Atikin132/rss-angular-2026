import { RegisterRequests } from '../models/api/register-request.model';
import { RegisterFormValue } from '../models/forms/register-form-value.model';

export function mapRegisterFormToRequests(form: RegisterFormValue): RegisterRequests {
  return {
    account: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    },

    dateOfBirth: {
      dateOfBirth: form.dateOfBirth?.toISOString().slice(0, 10) ?? '',
    },

    address: {
      streetName: form.street,
      city: form.city,
      postalCode: form.postalCode,
      country: form.country,
    },
  };
}
