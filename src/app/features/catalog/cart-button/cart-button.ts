import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../models/product.model';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-cart-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './cart-button.html',
  styleUrl: './cart-button.scss',
})
export class CartButton {
  private cartService = inject(CartService);

  product = input.required<Product>();

  hovered = signal(false);

  readonly inCart = computed(() =>
    this.cartService.items().some((item) => item.productId === this.product().id),
  );

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

  async toggleCart(event: MouseEvent): Promise<void> {
    event.stopPropagation();

    if (this.inCart()) {
      await this.cartService.removeFromCartByProductId(this.product().id);
      return;
    }

    await this.cartService.addToCart(this.product().id);
  }
}
