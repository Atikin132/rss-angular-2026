import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-breadcrumbs',
  imports: [RouterLink, MatIconModule],
  templateUrl: './product-breadcrumbs.html',
  styleUrl: './product-breadcrumbs.scss',
})
export class ProductBreadcrumbs {
  productName = input.required<string>();
  slug = input.required<string>();

  breadcrumbs = computed(() => {
    const name = this.productName();
    const currentSlug = this.slug();
    return [
      { label: 'Catalog', url: '/catalog' },
      { label: name, url: `/${currentSlug}` },
    ];
  });
}
