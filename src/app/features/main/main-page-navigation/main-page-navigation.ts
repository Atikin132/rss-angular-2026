import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page-navigation',
  imports: [MatCardModule, MatIconModule, RouterLink],
  templateUrl: './main-page-navigation.html',
  styleUrl: './main-page-navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageNavigation {
  pages = [
    { label: 'Catalog', icon: 'menu_book', route: '/catalog' },
    { label: 'Cart', icon: 'shopping_cart', route: '/cart' },
    { label: 'Profile', icon: 'person', route: '/profile' },
    { label: 'About', icon: 'info', route: '/about' },
  ];
}
