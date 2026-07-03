import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Search } from './search/search';
import { Sort, SortType } from './sort/sort';
import { CatalogFilters, Filters } from './filters/filters';
import { PRODUCTS_ON_PAGE, ProductsStore } from './stores/products.store';
import { ProductGrid } from './product-grid/product-grid';
import { CartService } from '../cart/services/cart.service';
import { Pagination } from './pagination/pagination';
@Component({
  selector: 'app-catalog',
  imports: [ProductGrid, Search, Sort, Filters, Pagination],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class CatalogPage implements OnInit {
  store = inject(ProductsStore);
  private cartService = inject(CartService);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  products = this.store.products;

  categories = this.store.categories;
  brands = this.store.brands;

  loading = this.store.loading;
  error = this.store.error;

  filters = this.store.filters;

  total = this.store.total;

  currentPage = signal(1);
  pageSize = PRODUCTS_ON_PAGE;

  totalPages = computed(() => Math.ceil(this.total() / this.pageSize));

  ngOnInit() {
    this.store.loadProducts();
    this.cartService.ensureCart();
  }

  onSearchChange(value: string) {
    const searchValue = (value ?? '').trim();

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(1);
      this.store.loadProductsPage(1, searchValue, this.store.sortType(), true);
    }, 300);
  }

  onSortChange(value: SortType) {
    this.currentPage.set(1);
    this.store.loadProductsPage(1, this.store.searchQuery(), value);
  }

  onFiltersChange(filters: CatalogFilters) {
    this.currentPage.set(1);
    this.store.loadProductsByFilters(filters);
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.store.loadProductsPage(page, this.store.searchQuery(), this.store.sortType());
  }
}
