import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { PRODUCTS_MOCK } from '../mock/products.mock';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly productsSignal = signal<Product[]>(PRODUCTS_MOCK);

  public readonly products = this.productsSignal.asReadonly();

  private readonly productsMap = computed(
    () => new Map(this.productsSignal().map((p) => [p.slug, p])),
  );

  getProductBySlug(slug: string) {
    return computed(() => this.productsMap().get(slug));
  }

  getProductsByCategory(category: string) {
    return computed(() => this.productsSignal().filter((p) => p.categories.includes(category)));
  }

  getCategories() {
    return computed(() => {
      const products = this.productsSignal();

      return [...new Set(products.flatMap((p) => p.categories))];
    });
  }
}
