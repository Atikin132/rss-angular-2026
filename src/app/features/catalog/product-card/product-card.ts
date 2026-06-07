import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../models/product.model';
import { CartButton } from '../cart-button/cart-button';
import { WishlistButton } from '../wishlist-button/wishlist-button';
import { CompareButton } from '../compare-button/compare-button';
import { ProductPrice } from '../product-price/product-price';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CartButton, CompareButton, WishlistButton, ProductPrice],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();
}
