import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ProductsStore } from '../stores/products.store';
import { ProductGallery } from './product-gallery/product-gallery';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../models/product.model';
import { ProductBreadcrumbs } from './product-breadcrumbs/product-breadcrumbs';
import { CartButton } from '../cart-button/cart-button';
import { WishlistButton } from '../wishlist-button/wishlist-button';

@Component({
  selector: 'app-product-details',
  imports: [
    ProductGallery,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    ProductBreadcrumbs,
    CartButton,
    WishlistButton,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetailsPage {
  private store = inject(ProductsStore);

  readonly slug = input<string | null>(null);

  readonly product = signal<Product | null>(null);
  isLoading = this.store.loading;

  isCompared = signal(false);

  readonly actualPrice = computed(() => this.product()?.discountedPrice ?? this.product()?.price);
  readonly hasDiscount = computed(() => this.product()?.discountedPrice != null);

  constructor() {
    effect(async () => {
      const currentSlug = this.slug();

      if (currentSlug !== null) {
        const fetchedProduct = await this.store.loadProductBySlug(currentSlug);
        this.product.set(fetchedProduct);
      }
    });
  }

  toggleCompare(event: MouseEvent): void {
    event.stopPropagation();
    this.isCompared.update((value) => !value);
  }
}
