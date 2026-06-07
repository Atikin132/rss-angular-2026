import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();

  addedToCart = signal(false);
  hovered = signal(false);
  isFavorite = signal(false);
  isCompared = signal(false);

  readonly actualPrice = computed(() => this.product().discountedPrice ?? this.product().price);

  readonly hasDiscount = computed(() => this.product().discountedPrice != null);

  cartButtonState = computed(() => {
    if (this.addedToCart() && this.hovered()) {
      return {
        text: 'Remove',
        icon: 'remove_shopping_cart',
        remove: true,
        added: true,
      };
    }

    if (this.addedToCart()) {
      return {
        text: 'In Cart',
        icon: 'check',
        remove: false,
        added: true,
      };
    }

    return {
      text: 'Add to Cart',
      icon: 'add_shopping_cart',
      remove: false,
      added: false,
    };
  });

  toggleCart(event: MouseEvent): void {
    event.stopPropagation();
    this.addedToCart.update((value) => !value);
  }

  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    this.isFavorite.update((value) => !value);
  }

  toggleCompare(event: MouseEvent): void {
    event.stopPropagation();
    this.isCompared.update((value) => !value);
  }
}
