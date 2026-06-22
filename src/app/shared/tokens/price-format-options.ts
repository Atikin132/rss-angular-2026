import { InjectionToken } from '@angular/core';

export interface PriceFormatOptions {
  currencyCode: string;
  locale: string;
}

export const PRICE_FORMAT_OPTIONS = new InjectionToken<PriceFormatOptions>('PRICE_FORMAT_OPTIONS');
