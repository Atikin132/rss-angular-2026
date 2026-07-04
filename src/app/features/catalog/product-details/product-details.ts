import { Component, effect, inject, input, signal } from '@angular/core';
import { ProductsStore } from '../stores/products.store';
import { ProductGallery } from './product-gallery/product-gallery';
import { Product } from '../models/product.model';
import { ProductBreadcrumbs } from './product-breadcrumbs/product-breadcrumbs';
import { CartButton } from '../cart-button/cart-button';
import { WishlistButton } from '../wishlist-button/wishlist-button';
import { CompareButton } from '../compare-button/compare-button';
import { ProductPrice } from '../product-price/product-price';
import { CartService } from '../../cart/services/cart.service';
import { ProductReviewsBlock } from '../../reviews/product-reviews-block/product-reviews-block';
import { ProductImageModal } from './product-image-modal/product-image-modal';

@Component({
  selector: 'app-product-details',
  imports: [
    ProductGallery,
    ProductBreadcrumbs,
    CartButton,
    WishlistButton,
    CompareButton,
    ProductPrice,
    ProductReviewsBlock,
    ProductImageModal,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetailsPage {
  private store = inject(ProductsStore);
  private cartService = inject(CartService);

  readonly slug = input<string | null>(null);

  readonly product = signal<Product | null>(null);
  isLoading = this.store.loading;

  constructor() {
    this.cartService.ensureCart();
    effect(async () => {
      const currentSlug = this.slug();

      if (currentSlug !== null) {
        const fetchedProduct = await this.store.loadProductBySlug(currentSlug);
        this.product.set(fetchedProduct);
      }
    });
  }

  modalOpened = signal(false);

  selectedImageIndex = signal(0);

  openGallery(index: number): void {
    this.selectedImageIndex.set(index);
    this.modalOpened.set(true);
  }

  closeGallery(): void {
    this.modalOpened.set(false);
  }
}
