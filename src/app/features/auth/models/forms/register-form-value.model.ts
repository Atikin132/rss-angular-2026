export interface AddressFormValue {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface RegisterFormValue {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date | null;

  useSeparateAddresses: boolean;

  shippingAddress: AddressFormValue;
  billingAddress: AddressFormValue;
}
