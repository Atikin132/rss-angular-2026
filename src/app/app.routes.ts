import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component/main-layout.component';
import { MainPage } from './features/main/page/main.page';
import { CatalogPage } from './features/catalog/catalog/page/catalog.page';
import { ProductDetailsPage } from './features/catalog/product-details/page/product-details.page';
import { ProfilePage } from './features/profile/page/profile.page';
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
        component: CatalogPage,
      },
      {
        path: 'catalog/product/:id',
        component: ProductDetailsPage,
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
        loadComponent: () => import('./features/about/page/about.page').then((m) => m.AboutPage),
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
