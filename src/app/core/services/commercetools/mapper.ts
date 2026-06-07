import { Product } from '../../../features/catalog/models/product.model';

import { CommercetoolsProductProjection, ProductAttribute } from './commercetools.types';

export const mapProduct = (product: CommercetoolsProductProjection): Product => {
  const variant = product.masterVariant;

  const attributes = product.attributes || [];

  const getAttribute = (name: string): ProductAttribute['value'] | undefined =>
    attributes.find((attr) => attr.name === name)?.value;

  const brand = getAttribute('brand');

  const inStock = getAttribute('inStock');

  const priceData = variant.prices?.[0];

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

    category: product.categories?.[0]?.obj?.name?.['en-US'] || '',

    brand: typeof brand === 'string' ? brand : '',

    inStock: typeof inStock === 'boolean' ? inStock : true,
  };
};
