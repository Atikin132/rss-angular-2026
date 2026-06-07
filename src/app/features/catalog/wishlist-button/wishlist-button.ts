import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../models/product.model';
import { WishlistStore } from '../stores/wishlist.store';

@Component({
  selector: 'app-wishlist-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './wishlist-button.html',
  styleUrl: './wishlist-button.scss',
})
export class WishlistButton {
  private wishlistStore = inject(WishlistStore);

  product = input.required<Product>();

  readonly inWishlist = computed(() => this.wishlistStore.productIds().includes(this.product().id));

  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    this.wishlistStore.toggle(this.product().id);
  }
}
