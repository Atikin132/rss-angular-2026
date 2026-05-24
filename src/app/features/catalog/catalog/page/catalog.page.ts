import { Component, computed, inject, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductCard } from '../product-card/product-card';
import { Search } from '../search/search';
import { Sort, SortType } from '../sort/sort';

@Component({
  selector: 'app-catalog.page',
  imports: [ProductCard, Search, Sort],
  templateUrl: './catalog.page.html',
  styleUrl: './catalog.page.scss',
})
export class CatalogPage {
  private productsService = inject(ProductsService);

  products = this.productsService.products;

  search = signal('');
  sort = signal<SortType>('name-asc');

  filteredAndSortedProducts = computed(() => {
    const query = this.search().toLowerCase().trim();

    let products = [...this.products()];

    if (query) {
      products = products.filter((product) => product.name.toLowerCase().includes(query));
    }

    switch (this.sort()) {
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;

      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
    }

    return products;
  });

  onSearchChange(value: string) {
    this.search.set(value);
  }

  onSortChange(value: SortType) {
    this.sort.set(value);
  }
}
