import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../models/product.model';
import { CartButton } from '../cart-button/cart-button';
import { WishlistButton } from '../wishlist-button/wishlist-button';
import { CompareButton } from '../compare-button/compare-button';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe, CartButton, CompareButton, WishlistButton],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();

  readonly actualPrice = computed(() => this.product().discountedPrice ?? this.product().price);

  readonly hasDiscount = computed(() => this.product().discountedPrice != null);
}
