export interface Product {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  createdBy: AuditUser;
  lastModifiedBy: AuditUser;
  productType: Reference;
  taxCategory: Reference;
  key: string;
  priceMode: string;
  lastVariantId: number;
  masterData: ProductMasterData;
}

export interface ProductMasterData {
  current: ProductData;
  staged: ProductData;
  published: boolean;
  hasStagedChanges: boolean;
}

export interface ProductData {
  name: LocalizedString;
  description: LocalizedString;
  slug: LocalizedString;

  categories: Reference[];
  categoryOrderHints: Record<string, unknown>;

  metaTitle: LocalizedString;
  metaDescription: LocalizedString;

  masterVariant: ProductVariant;
  variants: ProductVariant[];

  searchKeywords: Record<string, unknown>;

  attributes: Attribute[];
}

export interface ProductVariant {
  id: number;
  sku: string;

  prices: Price[];
  images: Image[];

  attributes: Attribute[];
  assets: Asset[];
}

export interface Price {
  id: string;
  value: PriceValue;
}

export interface PriceValue {
  type: string;
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
}

export interface Image {
  url: string;
  label?: string;
  dimensions: {
    w: number;
    h: number;
  };
}

export type AttributeValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | Record<string, unknown>;

export interface Attribute {
  name: string;
  value: AttributeValue;
}

export interface Asset {
  id?: string;
}

export interface Reference {
  typeId: string;
  id: string;
}

export type Locale = 'en-US' | 'de-DE';

export type LocalizedString = Partial<Record<Locale, string>>;

export interface AuditUser {
  isPlatformClient: boolean;
  user: {
    typeId: string;
    id: string;
  };
}
