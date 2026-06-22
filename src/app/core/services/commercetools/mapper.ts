import { Product } from '../../../features/catalog/models/product.model';

import {
  CommercetoolsCategory,
  CommercetoolsProductProjection,
  ProductAttribute,
} from './commercetools.types';

export const mapCategories = (categories: CommercetoolsCategory[]): Map<string, string> => {
  return new Map(categories.map((category) => [category.id, category.name['en-US'] ?? '']));
};

export const mapProduct = (
  product: CommercetoolsProductProjection,
  categoriesMap: Map<string, string>,
): Product => {
  const variant = product.masterVariant;

  const attributes = variant.attributes || [];

  const getAttribute = (name: string): ProductAttribute['value'] | undefined =>
    attributes.find((attr) => attr.name === name)?.value;

  const brand = getAttribute('brand');
  const inStock = getAttribute('inStock');

  const priceData = variant.prices?.[0];

  const categoryId = product.categories?.[0]?.id;

  return {
    id: product.id,

    name: product.name['en-US'] || '',

    slug: product.slug['en-US'] || '',

    description: product.description?.['en-US'] || '',

    image: variant.images?.[0]?.url || '',

    images: variant.images?.map((img) => img.url) || [],

    price: (priceData?.value.centAmount || 0) / 100,

    discountedPrice: priceData?.discounted?.value.centAmount
      ? priceData.discounted.value.centAmount / 100
      : undefined,

    currency: priceData?.value.currencyCode || 'USD',

    category: categoryId ? (categoriesMap.get(categoryId) ?? '') : '',

    brand: typeof brand === 'string' ? brand : '',

    inStock: typeof inStock === 'boolean' ? inStock : true,
  };
};
