import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Search } from './search/search';
import { Sort, SortType } from './sort/sort';
import { CatalogFilters, Filters } from './filters/filters';
import { ProductsStore } from './stores/products.store';
import { filterProducts } from './utils/filter-products';
import { sortMap } from './utils/sort-map';
import { ProductCard } from './product-card/product-card';

@Component({
  selector: 'app-catalog',
  imports: [ProductCard, Search, Sort, Filters],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class CatalogPage implements OnInit {
  private store = inject(ProductsStore);

  products = this.store.products;

  categories = this.store.categories;
  brands = this.store.brands;

  loading = this.store.loading;
  error = this.store.error;

  search = signal('');
  sort = signal<SortType>('name-asc');

  filters = signal<CatalogFilters>({
    categories: [],
    brands: [],
    minPrice: null,
    maxPrice: null,
  });

  ngOnInit() {
    this.store.loadProducts();
  }

  filteredAndSortedProducts = computed(() => {
    return filterProducts(this.products(), this.search(), this.filters())
      .slice()
      .sort(sortMap[this.sort()]);
  });

  onSearchChange(value: string) {
    this.search.set(value);
  }

  onSortChange(value: SortType) {
    this.sort.set(value);
  }
}
