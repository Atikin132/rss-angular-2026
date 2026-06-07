import { Routes } from '@angular/router';
import { CatalogPage } from './catalog';
import { ProductDetailsPage } from './product-details/product-details';

export const catalogRoutes: Routes = [
  {
    path: '',
    component: CatalogPage,
  },
  {
    path: 'product/:id',
    component: ProductDetailsPage,
  },
];
