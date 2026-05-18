import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CartItem } from '../../interfaces/cart-item.interface';
import { CartItemComponent } from '../cart-item.component/cart-item.component';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [CartItemComponent],
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartListComponent {
  items = input.required<CartItem[]>();

  increase = output<string>();
  decrease = output<string>();
  remove = output<string>();

  onIncrease(id: string): void {
    this.increase.emit(id);
  }

  onDecrease(id: string): void {
    this.decrease.emit(id);
  }

  onRemove(id: string): void {
    this.remove.emit(id);
  }
}
