export interface User {
  firstName: string;
  lastName: string;
  email: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}
