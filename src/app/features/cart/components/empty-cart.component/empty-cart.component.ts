import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-cart',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './empty-cart.component.html',
  styleUrl: './empty-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyCartComponent {}
