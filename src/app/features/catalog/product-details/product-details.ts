import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ProductsStore } from '../products.store';
import { ProductGallery } from './product-gallery/product-gallery';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../models/product.model';
import { ProductBreadcrumbs } from './product-breadcrumbs/product-breadcrumbs';

@Component({
  selector: 'app-product-details',
  imports: [ProductGallery, MatButtonModule, MatIconModule, CurrencyPipe, ProductBreadcrumbs],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetailsPage {
  private store = inject(ProductsStore);

  readonly slug = input<string | null>(null);

  readonly product = signal<Product | null>(null);
  isLoading = this.store.loading;

  addedToCart = signal(false);
  hovered = signal(false);
  isFavorite = signal(false);
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

  cartButtonState = computed(() => {
    if (this.addedToCart() && this.hovered()) {
      return {
        text: 'Remove',
        icon: 'remove_shopping_cart',
        remove: true,
        added: true,
      };
    }

    if (this.addedToCart()) {
      return {
        text: 'In Cart',
        icon: 'check',
        remove: false,
        added: true,
      };
    }

    return {
      text: 'Add to Cart',
      icon: 'add_shopping_cart',
      remove: false,
      added: false,
    };
  });

  toggleCart(event: MouseEvent): void {
    event.stopPropagation();
    this.addedToCart.update((value) => !value);
  }

  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    this.isFavorite.update((value) => !value);
  }

  toggleCompare(event: MouseEvent): void {
    event.stopPropagation();
    this.isCompared.update((value) => !value);
  }
}
