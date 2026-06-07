import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartStore } from '../stores/cart.store';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-cart-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './cart-button.html',
  styleUrl: './cart-button.scss',
})
export class CartButton {
  private cartStore = inject(CartStore);

  product = input.required<Product>();

  hovered = signal(false);

  readonly inCart = computed(() => this.cartStore.productIds().includes(this.product().id));

  readonly cartButtonState = computed(() => {
    const inCart = this.inCart();
    const hovered = this.hovered();

    if (inCart && hovered) {
      return {
        text: 'Remove',
        icon: 'remove_shopping_cart',
        remove: true,
        added: true,
      };
    }

    if (inCart) {
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
    this.cartStore.toggle(this.product().id);
  }
}
