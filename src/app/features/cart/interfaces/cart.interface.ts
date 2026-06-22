import { CartItem } from './cart-item.interface';

export interface Cart {
  id: string;
  version: number;
  customerId?: string;
  items: CartItem[];
  totalItems: number;
  subtotalPrice: number;
  discountedSubtotalPrice?: number;
  totalPrice: number;
  currencyCode: string;
  discountCodes: string[];
}
