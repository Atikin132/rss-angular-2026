import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component/auth-layout.component';
import { LoginPage } from './pages/login.page/login.page';
import { RegisterPage } from './pages/register.page/register.page';
import { UnknownPage } from './pages/unknown.page/unknown.page';
import { MainPage } from './pages/main.page/main.page';
import { CatalogPage } from './pages/catalog.page/catalog.page';
import { ProductDetailsPage } from './pages/product-details.page/product-details.page';

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
