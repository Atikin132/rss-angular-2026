import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Search } from './search/search';
import { Sort, SortType } from './sort/sort';
import { CatalogFilters, Filters } from './filters/filters';
import { ProductsStore } from './stores/products.store';
import { sortMap } from './utils/sort-map';
import { ProductGrid } from './product-grid/product-grid';
import { CartService } from '../cart/services/cart.service';
@Component({
  selector: 'app-catalog',
  imports: [ProductGrid, Search, Sort, Filters],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class CatalogPage implements OnInit {
  private store = inject(ProductsStore);
  private cartService = inject(CartService);

  products = this.store.products;

  categories = this.store.categories;
  brands = this.store.brands;

  loading = this.store.loading;
  error = this.store.error;

  search = signal('');
  sort = signal<SortType>('name-asc');

  filters = this.store.filters;

  ngOnInit() {
    this.store.loadProducts();
    this.cartService.ensureCart();
  }

  filteredAndSortedProducts = computed(() => {
    const q = this.search().toLowerCase().trim();

    return this.products()
      .filter((p) => !q || p.name.toLowerCase().includes(q))
      .slice()
      .sort(sortMap[this.sort()]);
  });

  onSearchChange(value: string) {
    this.search.set(value);
  }

  onSortChange(value: SortType) {
    this.sort.set(value);
  }

  onFiltersChange(filters: CatalogFilters) {
    this.store.loadProductsByFilters(filters);
  }
}
