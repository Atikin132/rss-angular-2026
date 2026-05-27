import { computed, inject, Injectable, signal } from '@angular/core';

import { Product } from '../models/product.model';
import { mapProduct } from '../../../core/services/commercetools/mapper';
import { ApiService } from '../../../core/services/commercetools/commercetools-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly productsSignal = signal<Product[]>([]);

  public readonly products = this.productsSignal.asReadonly();

  private readonly apiService = inject(ApiService);

  constructor() {
    this.loadProducts();
  }
  async loadProducts() {
    const data = await this.apiService.request(
      '/product-projections?limit=50&expand=categories[*]',
    );

    const mappedProducts = data.results.map(mapProduct);

    this.productsSignal.set(mappedProducts);
  }

  private readonly productsMap = computed(
    () => new Map(this.productsSignal().map((p) => [p.slug, p])),
  );

  getProductBySlug(slug: string) {
    return computed(() => this.productsMap().get(slug));
  }

  getProductsByCategory(category: string) {
    return computed(() => this.productsSignal().filter((p) => p.category === category));
  }

  getCategories() {
    return computed(() => {
      const products = this.productsSignal();
      return [...new Set(products.map((p) => p.category))].sort();
    });
  }

  getBrands() {
    return computed(() => {
      const products = this.productsSignal();
      return [...new Set(products.map((p) => p.brand))].sort();
    });
  }
}
