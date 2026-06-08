import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  readonly cartService = inject(CartService);
  readonly totalPrice = this.cartService.totalPrice;
}
