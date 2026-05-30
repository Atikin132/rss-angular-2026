import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

export type SortType = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

@Component({
  selector: 'app-sort',
  imports: [MatFormFieldModule, MatIconModule],
  templateUrl: './sort.html',
  styleUrl: './sort.scss',
})
export class Sort {
  value = input<SortType>('name-asc');

  valueChange = output<SortType>();

  options: { value: SortType; label: string }[] = [
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ];

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.valueChange.emit(value as SortType);
  }
}
