import { Component, computed, inject, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductCard } from '../product-card/product-card';
import { Search } from '../search/search';

@Component({
  selector: 'app-catalog.page',
  imports: [ProductCard, Search],
  templateUrl: './catalog.page.html',
  styleUrl: './catalog.page.scss',
})
export class CatalogPage {
  private productsService = inject(ProductsService);

  products = this.productsService.products;

  search = signal('');

  searchedProducts = computed(() => {
    const query = this.search().toLowerCase().trim();

    if (!query) {
      return this.products();
    }

    return this.products().filter((products) => products.name.toLowerCase().includes(query));
  });

  onSearchChange(value: string) {
    this.search.set(value);
  }
}
