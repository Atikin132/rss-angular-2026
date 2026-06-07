import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../models/product.model';
import { CartButton } from '../cart-button/cart-button';
import { WishlistButton } from '../wishlist-button/wishlist-button';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, MatButtonModule, MatIconModule, CurrencyPipe, CartButton, WishlistButton],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();

  isCompared = signal(false);

  readonly actualPrice = computed(() => this.product().discountedPrice ?? this.product().price);

  readonly hasDiscount = computed(() => this.product().discountedPrice != null);

  toggleCompare(event: MouseEvent): void {
    event.stopPropagation();
    this.isCompared.update((value) => !value);
  }
}
