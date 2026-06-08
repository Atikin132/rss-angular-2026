import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component/main-layout.component';
import { MainPage } from './features/main/page/main.page';
import { authRoutes } from './features/auth/auth.routes';
import { wildcardRoutes } from './features/wildcard/wildcard.routes';
import { authGuard } from './features/auth/guards/auth.guard';

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
        loadComponent: () => import('./features/cart/cart.page').then((m) => m.CartPage),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/profile/profile.routes').then((m) => m.ProfileRoutes),
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/page/about.page').then((m) => m.AboutPage),
      },
    ],
  },

  ...authRoutes,

  ...wildcardRoutes,
];
