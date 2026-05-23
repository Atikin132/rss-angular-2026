import { Component, input, signal } from '@angular/core';
import { Product } from '../../models/product.model';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PricePipe } from './price-pipe';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, MatButtonModule, MatIconModule, PricePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();

  addedToCart = signal(false);
  hovered = signal(false);
  isFavorite = signal(false);
  isCompared = signal(false);

  toggleCart(event: MouseEvent): void {
    event.stopPropagation();
    this.addedToCart.update((value) => !value);
  }

  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    this.isFavorite.update((value) => !value);
  }

  toggleCompare(event: MouseEvent): void {
    event.stopPropagation();

    this.isCompared.update((value) => !value);
  }
}
