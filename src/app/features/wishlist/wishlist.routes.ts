import { Routes } from '@angular/router';
import { WishlistPage } from './wishlist';
import { ProductDetailsPage } from '../catalog/product-details/product-details';

export const wishlistRoutes: Routes = [
  {
    path: '',
    component: WishlistPage,
  },
  {
    path: 'product/:slug',
    component: ProductDetailsPage,
  },
];
