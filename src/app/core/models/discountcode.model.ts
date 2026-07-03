export interface LocalizedString {
  'de-DE': string;
  'en-US': string;
}

export interface Reference {
  typeId: string;
  id: string;
}

export interface DiscountCode {
  id: string;
  version: number;
  versionModifiedAt: string;
  createdAt: string;
  lastModifiedAt: string;
  code: string;
  key: string;
  name: LocalizedString;
  description: LocalizedString;
  cartDiscounts: Reference[];
  isActive: boolean;
  references: Reference[];
  groups: string[];
  stores: Reference[];
}
