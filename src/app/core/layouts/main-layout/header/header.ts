import { Component, computed, HostListener, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartBadgeComponent } from '../../../../features/cart/cart-badge.component/cart-badge.component';
import { CustomerService } from '../../../../features/auth/services/customer.service';
import { AuthService } from '../../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CartBadgeComponent,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly customerService = inject(CustomerService);
  protected readonly authService = inject(AuthService);

  logout = output<void>();

  isMenuOpen = signal<boolean>(false);

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  navItems = computed(() => [
    {
      type: 'link',
      label: 'Main',
      icon: 'home',
      route: '/',
    },
    {
      type: 'link',
      label: 'Catalog',
      icon: 'menu_book',
      route: '/catalog',
    },
    {
      type: 'link',
      label: 'Wishlist',
      icon: 'favorite',
      route: '/wishlist',
    },
    {
      type: 'cart',
      route: '/cart',
    },
    {
      type: 'link',
      label: this.customerService.fullName(),
      icon: 'person',
      route: '/profile',
    },
    {
      type: 'link',
      label: 'About',
      icon: 'info',
      route: '/about',
    },
  ]);

  onLogout(): void {
    this.logout.emit();
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.toolbar')) {
      this.closeMenu();
    }
  }
}
