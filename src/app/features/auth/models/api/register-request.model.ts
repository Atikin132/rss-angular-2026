export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AddDateOfBirthRequest {
  dateOfBirth: string;
}

export interface AddAddressRequest {
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface RegisterRequests {
  account: RegisterRequest;
  dateOfBirth: AddDateOfBirthRequest;
  useSeparateAddresses: boolean;
  shippingAddress: AddAddressRequest;
  billingAddress?: AddAddressRequest;
}
