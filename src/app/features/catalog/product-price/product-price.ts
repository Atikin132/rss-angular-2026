import { Component, computed, input } from '@angular/core';
import { Product } from '../models/product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-price',
  imports: [CurrencyPipe],
  templateUrl: './product-price.html',
  styleUrl: './product-price.scss',
})
export class ProductPrice {
  product = input.required<Product>();

  readonly actualPrice = computed(() => this.product().discountedPrice ?? this.product().price);

  readonly hasDiscount = computed(() => this.product().discountedPrice != null);
}
