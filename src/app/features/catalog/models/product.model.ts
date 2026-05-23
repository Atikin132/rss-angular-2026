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
  categories: string[];
  brand?: string;
  inStock: boolean;
}
