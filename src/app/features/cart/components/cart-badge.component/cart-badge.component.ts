import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart-badge',
  standalone: true,
  imports: [RouterLink, MatBadgeModule, MatIconModule],
  templateUrl: './cart-badge.component.html',
  styleUrl: './cart-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartBadgeComponent {
  count = input(0);
}
