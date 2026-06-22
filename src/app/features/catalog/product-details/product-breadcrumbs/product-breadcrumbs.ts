import { Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ProductsStore } from '../../stores/products.store';
import { CATEGORY_ICONS } from './category-breadcrumbs-icons';

interface Breadcrumb {
  label: string;
  url: string;
  icon: string;
  type: 'catalog' | 'wishlist' | 'product' | 'category';
}
@Component({
  selector: 'app-product-breadcrumbs',
  imports: [RouterLink, MatIconModule],
  templateUrl: './product-breadcrumbs.html',
  styleUrl: './product-breadcrumbs.scss',
})
export class ProductBreadcrumbs {
  private router = inject(Router);
  protected store = inject(ProductsStore);

  productName = input.required<string>();
  slug = input.required<string>();

  categoryName = input.required<string>();

  currentUrl = this.router.url;
  fromPage = this.currentUrl.split('/')[1];
  fromPageCapitalized = this.fromPage.charAt(0).toUpperCase() + this.fromPage.slice(1);

  breadcrumbs = computed(() => {
    const name = this.productName();
    const currentSlug = this.slug();

    const list: Breadcrumb[] = [];
    if (this.fromPage === 'wishlist') {
      list.push({
        label: this.fromPageCapitalized,
        url: `/${this.fromPage}`,
        icon: 'favorite',
        type: 'wishlist',
      });
    } else if (this.fromPage === 'catalog') {
      list.push({
        label: this.fromPageCapitalized,
        url: `/${this.fromPage}`,
        icon: 'menu_book',
        type: 'catalog',
      });
      list.push({
        label: this.categoryName(),
        url: `/catalog`,
        icon: CATEGORY_ICONS[this.categoryName()],
        type: 'category',
      });
    }

    list.push({ label: name, url: `/${currentSlug}`, icon: '', type: 'product' });

    return list;
  });

  onCrumbClick(crumb: Breadcrumb) {
    if (crumb.type === 'category') {
      const foundCategory = this.store
        .categories()
        .find((category) => category.name === this.categoryName());
      this.store.loadProductsByFilters({
        categories: [foundCategory?.id ?? ''],
        brands: [],
        minPrice: null,
        maxPrice: null,
      });
    }
  }
}
