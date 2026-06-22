export interface CartItem {
  lineItemId: string;
  productId: string;
  variantId: number;
  sku?: string;

  name: string;
  imageUrl: string;

  unitPrice: number;
  discountedUnitPrice?: number;

  quantity: number;

  totalPrice: number;
  discountedTotalPrice?: number;

  currencyCode: string;
}
