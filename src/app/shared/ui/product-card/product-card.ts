import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { ProductCardItem } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard implements OnInit {
  product = input.required<ProductCardItem>();
  hasDiscount = false;

  ngOnInit(): void {
    this.hasDiscount = Boolean(this.product().discountedPrice);
  }
}
