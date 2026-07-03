import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CartItem } from '../interfaces/cart-item.interface';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, PricePipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  private readonly cartService = inject(CartService);

  item = input.required<CartItem>();

  readonly displayTotalPrice = computed(() => {
    const item = this.item();
    const subtotalPrice = this.cartService.subtotalPrice();
    const totalPrice = this.cartService.totalPrice();

    if (item.discountedTotalPrice != null) {
      return item.discountedTotalPrice;
    }

    if (subtotalPrice <= totalPrice) {
      return item.totalPrice;
    }

    return Math.round(item.totalPrice * (totalPrice / subtotalPrice) * 100) / 100;
  });

  readonly hasDiscount = computed(() => this.displayTotalPrice() < this.item().totalPrice);

  increase = output<string>();
  decrease = output<string>();
  remove = output<string>();

  onIncrease(): void {
    this.increase.emit(this.item().lineItemId);
  }

  onDecrease(): void {
    this.decrease.emit(this.item().lineItemId);
  }

  onRemove(): void {
    this.remove.emit(this.item().lineItemId);
  }
}
