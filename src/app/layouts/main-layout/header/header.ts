import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartBadgeComponent } from '../../../features/cart/components/cart-badge.component/cart-badge.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CartBadgeComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
