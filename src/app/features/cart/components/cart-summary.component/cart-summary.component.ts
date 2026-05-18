import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { CartItem } from '../../interfaces/cart-item.interface';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  items = input.required<CartItem[]>();

  totalPrice = computed(() =>
    this.items().reduce((total, item) => total + item.price * item.quantity, 0),
  );

  totalItems = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));
}
