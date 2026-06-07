import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ProductsStore } from '../stores/products.store';
import { ProductGallery } from './product-gallery/product-gallery';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../models/product.model';
import { ProductBreadcrumbs } from './product-breadcrumbs/product-breadcrumbs';
import { CartButton } from '../cart-button/cart-button';
import { WishlistButton } from '../wishlist-button/wishlist-button';
import { CompareButton } from '../compare-button/compare-button';

@Component({
  selector: 'app-product-details',
  imports: [
    ProductGallery,
    CurrencyPipe,
    ProductBreadcrumbs,
    CartButton,
    WishlistButton,
    CompareButton,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetailsPage {
  private store = inject(ProductsStore);

  readonly slug = input<string | null>(null);

  readonly product = signal<Product | null>(null);
  isLoading = this.store.loading;

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
}
