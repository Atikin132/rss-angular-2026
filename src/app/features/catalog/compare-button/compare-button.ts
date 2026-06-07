import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CompareStore } from '../stores/compare.store';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-compare-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './compare-button.html',
  styleUrl: './compare-button.scss',
})
export class CompareButton {
  private compareStore = inject(CompareStore);

  product = input.required<Product>();

  readonly inCompare = computed(() => this.compareStore.productIds().includes(this.product().id));

  toggleCompare(event: MouseEvent): void {
    event.stopPropagation();
    this.compareStore.toggle(this.product().id);
  }
}
