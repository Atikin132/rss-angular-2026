import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component/main-layout.component';
import { MainPage } from './features/main/page/main.page';
import { CatalogPage } from './features/catalog/catalog/page/catalog.page';
import { ProductDetailsPage } from './features/catalog/product-details/page/product-details.page';
import { ProfilePage } from './features/profile/page/profile.page';
import { AboutPage } from './features/about/page/about.page';
import { CartPage } from './features/cart/cart.page';
import { UnknownPage } from './features/wildcard-route/page/unknown.page';
import { authRoutes } from './features/auth/auth.routes';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
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
        component: AboutPage,
      },
    ],
  },

  ...authRoutes,

  {
    path: '**',
    component: UnknownPage,
  },
];
