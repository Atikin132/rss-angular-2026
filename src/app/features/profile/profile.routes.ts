import { Routes } from '@angular/router';
import { ProfilePage } from './page/profile.page';
import { AddressesComponent } from './pages/addresses/addresses.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SecurityComponent } from './pages/security/security.component';

export const ProfileRoutes: Routes = [
  {
    path: '',
    component: ProfilePage,
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
