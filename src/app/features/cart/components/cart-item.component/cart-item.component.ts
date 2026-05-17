import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cart-item.component',
  imports: [],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {}
