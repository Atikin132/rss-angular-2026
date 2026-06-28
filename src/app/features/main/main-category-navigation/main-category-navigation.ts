import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ProductsStore } from '../../catalog/stores/products.store';
import { CATEGORY_ICONS } from '../../catalog/product-details/product-breadcrumbs/category-breadcrumbs-icons';

@Component({
  selector: 'app-main-category-navigation',
  imports: [MatIconModule, MatCardModule],
  templateUrl: './main-category-navigation.html',
  styleUrl: './main-category-navigation.scss',
})
export class MainCategoryNavigation implements OnInit {
  private readonly router = inject(Router);
  private readonly store = inject(ProductsStore);

  categories = this.store.categories;

  protected readonly categoryIcons = CATEGORY_ICONS;

  openCategory(categoryId: string) {
    this.store.loadProductsByFilters({
      categories: [categoryId],
      brands: [],
      minPrice: null,
      maxPrice: null,
    });

    this.router.navigate(['/catalog']);
  }

  ngOnInit(): void {
    this.store.loadProducts();
  }
}
