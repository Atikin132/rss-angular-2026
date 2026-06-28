import { DiscountCode } from '../../../core/models/discountcode.model';

export interface DiscountCodesResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: DiscountCode[];
}
