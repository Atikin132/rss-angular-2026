export type LocalizedString = Record<string, string>;

export interface CategoryReference {
  id: string;
  obj?: {
    name: LocalizedString;
  };
}

export interface ProductAttribute {
  name: string;
  value: string | boolean | number;
}

export interface ProductImage {
  url: string;
  label?: string;
}

export interface ProductPrice {
  value: {
    currencyCode: string;
    centAmount: number;
  };

  discounted?: {
    value: {
      centAmount: number;
    };
  };
}

export interface ProductVariant {
  id: number;
  sku: string;
  prices?: ProductPrice[];
  images?: ProductImage[];
}

export interface CommercetoolsProductProjection {
  id: string;
  name: LocalizedString;
  slug: LocalizedString;
  description?: LocalizedString;
  categories?: CategoryReference[];
  masterVariant: ProductVariant;
  attributes?: ProductAttribute[];
}
