import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cart-list.component',
  imports: [],
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartListComponent {}
