import { CatalogFilters } from '../filters/filters';
import { Product } from '../models/product.model';
import { getProductPrice } from './product-price';

export function filterProducts(products: Product[], query: string, filters: CatalogFilters) {
  const q = query.toLowerCase().trim();

  const predicates: ((p: Product) => boolean)[] = [
    (p) => !q || p.name.toLowerCase().includes(q),
    (p) => !filters.categories.length || filters.categories.includes(p.category),
    (p) => !filters.brands.length || filters.brands.includes(p.brand),
    (p) => filters.minPrice === null || getProductPrice(p) >= filters.minPrice,
    (p) => filters.maxPrice === null || getProductPrice(p) <= filters.maxPrice,
  ];

  return products.filter((p) => predicates.every((fn) => fn(p)));
}
