export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  images: string[];
  price: number;
  discountedPrice?: number;
  currency: string;
  category: string;
  brand: string;
  inStock: boolean;
  variants: Variant[];
}
export interface Variant {
  id: number;
  sku: string;
  image: string;
  images: string[];
  price: number;
  discountedPrice?: number;
  currency: string;
  attributes: Record<string, string | boolean | number>;
}
