export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  addresses: UserAddress[];
}

export interface UserAddress {
  id: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}
