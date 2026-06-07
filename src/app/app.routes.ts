import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component/main-layout.component';
import { MainPage } from './features/main/page/main.page';
import { ProfilePage } from './features/profile/page/profile.page';
import { AboutPage } from './features/about/page/about.page';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component/auth-layout.component';
import { LoginPage } from './features/auth/login/page/login.page';
import { RegisterPage } from './features/auth/register/page/register.page';
import { UnknownPage } from './features/wildcard-route/page/unknown.page';
import { CartPage } from './features/cart/cart.page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: MainPage,
      },
      {
        path: 'catalog',
        loadChildren: () =>
          import('./features/catalog/catalog.routes').then((m) => m.catalogRoutes),
      },
      {
        path: 'cart',
        component: CartPage,
      },
      {
        path: 'profile',
        component: ProfilePage,
      },
      {
        path: 'about',
        component: AboutPage,
      },
    ],
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
  {
    path: '**',
    component: UnknownPage,
  },
];
