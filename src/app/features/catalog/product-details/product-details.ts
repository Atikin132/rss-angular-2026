import { Component, inject } from '@angular/core';
import { ProductsStore } from '../products.store';
import { ActivatedRoute } from '@angular/router';
import { ProductGallery } from './product-gallery/product-gallery';

@Component({
  selector: 'app-product-details',
  imports: [ProductGallery],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetailsPage {
  private route = inject(ActivatedRoute);
  private store = inject(ProductsStore);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (slug) {
        this.store.loadProductBySlug(slug);
      }
    });
  }

  product = this.store.selectedProduct;
  isLoading = this.store.loading;
}
