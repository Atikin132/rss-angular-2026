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

    useSeparateAddresses: form.useSeparateAddresses,

    shippingAddress: {
      streetName: form.shippingAddress.street,
      city: form.shippingAddress.city,
      postalCode: form.shippingAddress.postalCode,
      country: form.shippingAddress.country,
    },

    billingAddress: form.useSeparateAddresses
      ? {
          streetName: form.billingAddress.street,
          city: form.billingAddress.city,
          postalCode: form.billingAddress.postalCode,
          country: form.billingAddress.country,
        }
      : undefined,
  };
}
