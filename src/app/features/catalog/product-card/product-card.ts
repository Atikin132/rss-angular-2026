import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../models/product.model';
import { CartButton } from '../cart-button/cart-button';
import { WishlistButton } from '../wishlist-button/wishlist-button';
import { CompareButton } from '../compare-button/compare-button';
import { ProductPrice } from '../product-price/product-price';
import { ProductRatingBadge } from '../../reviews/product-rating-badge/product-rating-badge';

@Component({
  selector: 'app-product-card',
  imports: [
    RouterLink,
    CartButton,
    CompareButton,
    WishlistButton,
    ProductPrice,
    ProductRatingBadge,
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();
}
