import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-badge',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatBadgeModule, MatIconModule, MatButtonModule],
  templateUrl: './cart-badge.component.html',
  styleUrl: './cart-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartBadgeComponent {
  private readonly cartService = inject(CartService);
  readonly count = this.cartService.totalItems;
}
