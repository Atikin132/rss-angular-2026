import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-catalog.page',
  imports: [ProductCard],
  templateUrl: './catalog.page.html',
  styleUrl: './catalog.page.scss',
})
export class CatalogPage {
  private productsService = inject(ProductsService);

  products = this.productsService.products;
}
