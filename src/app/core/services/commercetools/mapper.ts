import { Product, Variant } from '../../../features/catalog/models/product.model';
import {
  CommercetoolsCategory,
  CommercetoolsProductProjection,
  ProductAttribute,
  ProductVariant,
} from './commercetools.types';

export const mapCategories = (categories: CommercetoolsCategory[]): Map<string, string> => {
  return new Map(categories.map((category) => [category.id, category.name['en-US'] ?? '']));
};

function mapVariant(variant: ProductVariant): Variant {
  const priceData = variant.prices?.[0];

  return {
    id: variant.id,

    sku: variant.sku,

    image: variant.images?.[0]?.url ?? '',

    images: variant.images?.map((image) => image.url) ?? [],

    price: (priceData?.value.centAmount ?? 0) / 100,

    discountedPrice: priceData?.discounted?.value.centAmount
      ? priceData.discounted.value.centAmount / 100
      : undefined,

    currency: priceData?.value.currencyCode ?? 'USD',

    attributes: Object.fromEntries(
      (variant.attributes ?? []).map((attribute) => [attribute.name, attribute.value]),
    ),
  };
}

export const mapProduct = (
  product: CommercetoolsProductProjection,
  categoriesMap: Map<string, string>,
): Product => {
  const masterVariant = product.masterVariant;

  const variants = [masterVariant, ...(product.variants ?? [])].map(mapVariant);

  const variant = variants[0];

  const attributes = masterVariant.attributes ?? [];

  const getAttribute = (name: string): ProductAttribute['value'] | undefined =>
    attributes.find((attr) => attr.name === name)?.value;

  const brand = getAttribute('brand');
  const inStock = getAttribute('inStock');

  const categoryId = product.categories?.[0]?.id;

  return {
    id: product.id,

    name: product.name['en-US'] ?? '',

    slug: product.slug['en-US'] ?? '',

    description: product.description?.['en-US'] ?? '',

    image: variant.image,

    images: variant.images,

    price: variant.price,

    discountedPrice: variant.discountedPrice,

    currency: variant.currency,

    category: categoryId ? (categoriesMap.get(categoryId) ?? '') : '',

    brand: typeof brand === 'string' ? brand : '',

    inStock: typeof inStock === 'boolean' ? inStock : true,

    variants,
  };
};
