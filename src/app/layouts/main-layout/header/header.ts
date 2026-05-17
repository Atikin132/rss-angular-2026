import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  logout = output<void>();

  navItems = [
    {
      label: 'Main',
      icon: 'home',
      route: '/',
    },
    {
      label: 'Catalog',
      icon: 'menu_book',
      route: '/catalog',
    },
    {
      label: 'Cart',
      icon: 'shopping_cart',
      route: '/cart',
    },
    {
      label: 'Profile',
      icon: 'person',
      route: '/profile',
    },
    {
      label: 'About',
      icon: 'info',
      route: '/about',
    },
  ];

  onLogout(): void {
    this.logout.emit();
  }
}
