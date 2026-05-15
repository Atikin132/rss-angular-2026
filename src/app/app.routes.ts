import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
  },
  {
    path: '',
    component: AuthLayoutComponent,
  },
];
