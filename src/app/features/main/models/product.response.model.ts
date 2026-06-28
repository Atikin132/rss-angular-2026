import { Product } from '../../../core/models/product.model';

export interface ProductResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
}
