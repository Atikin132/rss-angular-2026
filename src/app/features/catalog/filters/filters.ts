import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormField, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import {
  BrandOption,
  CategoryOption,
} from '../../../core/services/commercetools/commercetools.types';

export interface CatalogFilters {
  categories: string[];
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
}

@Component({
  selector: 'app-filters',
  imports: [MatButtonModule, MatFormField, MatSelectModule, MatSliderModule, MatCheckboxModule],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters {
  value = input.required<CatalogFilters>();

  valueChange = output<CatalogFilters>();

  categories = input<CategoryOption[]>([]);
  brands = input<BrandOption[]>([]);

  toggleCategory(categoryId: string) {
    const current = this.value();

    const categories = current.categories.includes(categoryId)
      ? current.categories.filter((id) => id !== categoryId)
      : [...current.categories, categoryId];

    this.valueChange.emit({
      ...current,
      categories,
    });
  }

  onBrandsChange(event: MatSelectChange) {
    const brands = event.value.filter(Boolean);

    this.valueChange.emit({
      ...this.value(),
      brands,
    });
  }

  updateMinPrice(value: string) {
    this.valueChange.emit({
      ...this.value(),
      minPrice: value ? Number(value) : null,
    });
  }

  updateMaxPrice(value: string) {
    this.valueChange.emit({
      ...this.value(),
      maxPrice: value ? Number(value) : null,
    });
  }

  onMinSliderChange(value: number) {
    this.valueChange.emit({
      ...this.value(),
      minPrice: value,
    });
  }

  onMaxSliderChange(value: number) {
    this.valueChange.emit({
      ...this.value(),
      maxPrice: value,
    });
  }

  clearAll() {
    this.valueChange.emit({
      categories: [],
      brands: [],
      minPrice: null,
      maxPrice: null,
    });
  }
}
