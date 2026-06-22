import { inject, Pipe, PipeTransform } from '@angular/core';
import { PRICE_FORMAT_OPTIONS } from '../tokens/price-format-options';

@Pipe({
  name: 'price',
  standalone: true,
})
export class PricePipe implements PipeTransform {
  private readonly option = inject(PRICE_FORMAT_OPTIONS);
  transform(
    value: number | null | undefined,
    currencyCode = this.option.currencyCode,
    locale = this.option.locale,
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value ?? 0);
  }
}
