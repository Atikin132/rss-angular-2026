import { Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-breadcrumbs',
  imports: [RouterLink, MatIconModule],
  templateUrl: './product-breadcrumbs.html',
  styleUrl: './product-breadcrumbs.scss',
})
export class ProductBreadcrumbs {
  private router = inject(Router);
  productName = input.required<string>();
  slug = input.required<string>();

  currentUrl = this.router.url;
  fromPage = this.currentUrl.split('/')[1];
  fromPageCapitalized = this.fromPage.charAt(0).toUpperCase() + this.fromPage.slice(1);

  breadcrumbs = computed(() => {
    const name = this.productName();
    const currentSlug = this.slug();

    return [
      { label: this.fromPageCapitalized, url: `/${this.fromPage}` },
      { label: name, url: `/${currentSlug}` },
    ];
  });
}
