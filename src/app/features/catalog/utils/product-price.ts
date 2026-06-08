import { Product } from '../models/product.model';

export function getProductPrice(product: Product) {
  return product.discountedPrice ?? product.price;
}
