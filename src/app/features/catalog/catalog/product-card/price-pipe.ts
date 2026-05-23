import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
})
export class PricePipe implements PipeTransform {
  private symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  transform(value: number, currency: string): string {
    const symbol = this.symbols[currency] ?? currency;

    return `${symbol}${value.toLocaleString()}`;
  }
}
