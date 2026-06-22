export interface AddAddressRequest {
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface UpdateAddressRequest extends AddAddressRequest {
  addressId: string;
}
