import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CartItem } from '../interfaces/cart-item.interface';
import { PricePipe } from '../../../shared/pipes/price.pipe';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, PricePipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  item = input.required<CartItem>();

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
