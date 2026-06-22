import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CartService } from '../services/cart.service';
import { PricePipe } from '../../../shared/pipes/price.pipe';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [PricePipe],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  readonly cartService = inject(CartService);
  readonly totalPrice = this.cartService.totalPrice;
  readonly subtotalPrice = this.cartService.subtotalPrice;
  readonly promoCode = signal('');

  async onApplyPromoCode(): Promise<void> {
    await this.cartService.applyPromoCode(this.promoCode());
    this.promoCode.set('');
  }
}
