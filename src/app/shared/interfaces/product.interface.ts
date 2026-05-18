export interface ProductCardItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  discountedPrice?: number;
  currencyCode: string;
  rating?: number;
  isInCart?: boolean;
  isFavorite?: boolean;
}
