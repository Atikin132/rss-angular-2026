import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empty-cart.component',
  imports: [],
  templateUrl: './empty-cart.component.html',
  styleUrl: './empty-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyCartComponent {}
