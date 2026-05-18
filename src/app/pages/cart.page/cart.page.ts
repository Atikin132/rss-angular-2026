import { Component } from '@angular/core';
import { CartListComponent } from '../../features/cart/components/cart-list.component/cart-list.component';
import { CartSummaryComponent } from '../../features/cart/components/cart-summary.component/cart-summary.component';
import { EmptyCartComponent } from '../../features/cart/components/empty-cart.component/empty-cart.component';
import { MOCK_CART_ITEMS } from '../../features/cart/mock/mock-cart-items';

@Component({
  selector: 'app-cart.page',
  standalone: true,
  imports: [CartListComponent, CartSummaryComponent, EmptyCartComponent],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
})
export class CartPage {
  protected readonly cartItems = MOCK_CART_ITEMS;

  onIncrease(id: string): void {
    // eslint-disable-next-line no-console
    console.log('increase', id);
  }

  onDecrease(id: string): void {
    // eslint-disable-next-line no-console
    console.log('decrease', id);
  }

  onRemove(id: string): void {
    // eslint-disable-next-line no-console
    console.log('remove', id);
  }
}
