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
  attributes?: ProductAttribute[];
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

export interface PagedResponse<T> {
  results: T[];
  limit: number;
  offset: number;
  count: number;
  total: number;

  facets?: ProductFacets;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface CommercetoolsCategory {
  id: string;
  name: Record<string, string>;
  slug: Record<string, string>;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface BrandOption {
  name: string;
  count: number;
}

export interface FacetTerm {
  term: string;
  count: number;
}

export interface FacetResult {
  type: 'terms';
  dataType: string;
  total: number;
  missing: number;
  other: number;
  terms: FacetTerm[];
}

export type ProductFacets = Record<string, FacetResult>;

export interface CommercetoolsMoney {
  currencyCode: string;
  centAmount: number;
}

export interface CommercetoolsCartPrice {
  value: CommercetoolsMoney;
  discounted?: {
    value: CommercetoolsMoney;
  };
}

export interface CommercetoolsLineItem {
  id: string;
  productId: string;
  name: LocalizedString;
  variant: {
    id: number;
    sku?: string;
    images?: ProductImage[];
  };
  price: CommercetoolsCartPrice;
  quantity: number;
  totalPrice: CommercetoolsMoney;
}

export interface CommercetoolsCart {
  id: string;
  version: number;
  customerId?: string;
  lineItems: CommercetoolsLineItem[];
  totalLineItemQuantity?: number;
  totalPrice: CommercetoolsMoney;
  discountCodes?: {
    discountCode: {
      id: string;
    };
  }[];
}

export type CommercetoolsCartUpdateAction =
  | {
      action: 'changeLineItemQuantity';
      lineItemId: string;
      quantity: number;
    }
  | {
      action: 'removeLineItem';
      lineItemId: string;
    }
  | {
      action: 'addDiscountCode';
      code: string;
    }
  | {
      action: 'addLineItem';
      productId: string;
      variantId: number;
      quantity: number;
    };
