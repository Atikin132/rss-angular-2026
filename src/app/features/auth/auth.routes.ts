import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../../core/layouts/auth-layout/auth-layout.component/auth-layout.component';
import { authReverseGuard } from './guards/auth-reverse.guard';

export const authRoutes: Routes = [
  {
    path: '',
    canActivate: [authReverseGuard],
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/page/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () => import('./register/page/register.page').then((m) => m.RegisterPage),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./reset-password/page/reset-password.page').then((m) => m.ResetPasswordPage),
      },
    ],
  },
];
