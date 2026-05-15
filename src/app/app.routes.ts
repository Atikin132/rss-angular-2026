import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component/auth-layout.component';
import { LoginPage } from './pages/login.page/login.page';
import { RegisterPage } from './pages/register.page/register.page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPage,
      },
      {
        path: 'register',
        component: RegisterPage,
      },
    ],
  },
];
