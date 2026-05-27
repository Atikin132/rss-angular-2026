import { Component, computed, inject, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductCard } from '../product-card/product-card';
import { Search } from '../search/search';
import { Sort, SortType } from '../sort/sort';
import { CatalogFilters, Filters } from '../filters/filters';
import { filterProducts } from '../../utils/filter-products';
import { sortMap } from '../../utils/sort-map';

@Component({
  selector: 'app-catalog.page',
  imports: [ProductCard, Search, Sort, Filters],
  templateUrl: './catalog.page.html',
  styleUrl: './catalog.page.scss',
})
export class CatalogPage {
  private productsService = inject(ProductsService);

  products = this.productsService.products;

  search = signal('');
  sort = signal<SortType>('name-asc');

  categories = this.productsService.getCategories();
  brands = this.productsService.getBrands();

  filters = signal<CatalogFilters>({
    categories: [],
    brands: [],
    minPrice: null,
    maxPrice: null,
  });

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
