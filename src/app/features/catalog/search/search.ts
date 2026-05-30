import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search',
  imports: [MatIconModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  value = input<string>('');
  valueChange = output<string>();

  onInput(event: Event) {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.valueChange.emit(target.value);
    }
  }
}
