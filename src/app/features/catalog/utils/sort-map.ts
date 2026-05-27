import { SortType } from '../catalog/sort/sort';
import { Product } from '../models/product.model';
import { getProductPrice } from './product-price';

export const sortMap: Record<SortType, (a: Product, b: Product) => number> = {
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'name-desc': (a, b) => b.name.localeCompare(a.name),
  'price-asc': (a, b) => getProductPrice(a) - getProductPrice(b),
  'price-desc': (a, b) => getProductPrice(b) - getProductPrice(a),
};
