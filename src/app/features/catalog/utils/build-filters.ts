import { CatalogFilters } from '../filters/filters';

export function buildFilters(filters: CatalogFilters): string {
  const params: string[] = [];

  if (filters.categories.length) {
    params.push(`filter=categories.id:${filters.categories.map((id) => `"${id}"`).join(',')}`);
  }

  if (filters.brands.length) {
    params.push(
      `filter=variants.attributes.brand:${filters.brands.map((brand) => `"${brand}"`).join(',')}`,
    );
  }

  if (filters.minPrice !== null) {
    params.push(`filter=variants.price.centAmount:range (${filters.minPrice * 100} to *)`);
  }

  if (filters.maxPrice !== null) {
    params.push(`filter=variants.price.centAmount:range (* to ${filters.maxPrice * 100})`);
  }

  return params.join('&');
}
