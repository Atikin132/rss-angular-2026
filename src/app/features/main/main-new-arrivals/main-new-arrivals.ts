import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/commercetools/commercetools-api.service';
import { ProductResponse } from '../models/product.response.model';
import { Product } from '../../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-new-arrivals',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './main-new-arrivals.html',
  styleUrl: './main-new-arrivals.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNewArrivals {
  private readonly api = inject(ApiService);

  newArrivals = signal<Product[]>([]);

  constructor() {
    this.loadNewArrivals();
  }

  private loadNewArrivals() {
    this.api.request<ProductResponse>('/products?limit=5&sort=lastModifiedAt+desc').then((res) => {
      this.newArrivals.set(res.results);
    });
  }
}
