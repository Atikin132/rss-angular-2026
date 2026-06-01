import { Routes } from '@angular/router';
import { AddressesComponent } from './pages/addresses/addresses.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SecurityComponent } from './pages/security/security.component';

export const ProfileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        component: ProfileComponent,
      },
      {
        path: 'security',
        component: SecurityComponent,
      },
      {
        path: 'addresses',
        component: AddressesComponent,
      },
    ],
  },
];
