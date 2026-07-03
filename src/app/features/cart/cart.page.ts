import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartListComponent } from './cart-list.component/cart-list.component';
import { CartSummaryComponent } from './cart-summary.component/cart-summary.component';
import { EmptyCartComponent } from './empty-cart.component/empty-cart.component';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-cart.page',
  standalone: true,
  imports: [CartListComponent, CartSummaryComponent, EmptyCartComponent],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
  constructor() {
    void this.cartService.ensureCart();
  }
  private readonly cartService = inject(CartService);
  readonly cartItems = this.cartService.items;

  onIncrease(id: string): void {
    this.cartService.increaseQuantity(id);
  }

  onDecrease(id: string): void {
    this.cartService.decreaseQuantity(id);
  }

  onRemove(id: string): void {
    this.cartService.removeItem(id);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }
}
