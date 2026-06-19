export interface Customer {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;

  lastModifiedBy: {
    isPlatformClient: boolean;
    user: {
      typeId: string;
      id: string;
    };
  };

  createdBy: {
    clientId: string;
    isPlatformClient: boolean;
  };

  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;

  password: string;

  addresses: Address[];
  shippingAddressIds: string[];
  billingAddressIds: string[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;

  isEmailVerified: boolean;

  customerGroupAssignments: CustomerGroupAssignment[];
  stores: Store[];

  authenticationMode: string;
}

export interface Address {
  id?: string;
  streetName?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  externalId?: string;
}

export interface CustomerGroupAssignment {
  customerGroup?: {
    typeId: string;
    id: string;
  };
}

export interface Store {
  typeId: string;
  id: string;
}
