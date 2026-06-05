import { Injectable, signal } from '@angular/core';
import { UserProfile } from '../interfaces/user-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly userProfile = signal<UserProfile>({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.j@example.com',
    dateOfBirth: '1992-05-14',
    addresses: [
      {
        id: 'address-1',
        streetName: 'Main Street 12',
        city: 'New York',
        postalCode: '10001',
        country: 'US',
        isDefaultShipping: true,
        isDefaultBilling: true,
      },
    ],
  });

  readonly profile = this.userProfile.asReadonly();

  getUserProfile(): UserProfile {
    return this.userProfile();
  }
}
