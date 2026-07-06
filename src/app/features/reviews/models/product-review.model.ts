export interface RawProductReview {
  rating: number;
  comment: string;
}

export interface CreateProductReview extends RawProductReview {
  productId: string;
  userId: string;
  userName: string;
}

export interface ProductReview extends CreateProductReview {
  id: string;
  createdAt: string;
}
