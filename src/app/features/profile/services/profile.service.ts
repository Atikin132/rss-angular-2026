import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserProfile } from '../interfaces/user-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly userProfile: UserProfile = {
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
  };

  getUserProfile(): Observable<UserProfile> {
    return of(this.userProfile);
  }
}
