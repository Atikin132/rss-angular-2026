import { Component, input } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCard],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGrid {
  products = input.required<Product[]>();
}
