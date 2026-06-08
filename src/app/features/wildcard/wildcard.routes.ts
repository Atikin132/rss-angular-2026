import { Routes } from '@angular/router';

export const wildcardRoutes: Routes = [
  {
    path: '**',
    loadComponent: () => import('./page/wildcard.page').then((m) => m.WildcardPage),
  },
];
