import {
  CommercetoolsCart,
  CommercetoolsLineItem,
} from '../../../core/services/commercetools/commercetools.types';
import { Cart } from '../interfaces/cart.interface';
import { CartItem } from '../interfaces/cart-item.interface';

export const mapCart = (cart: CommercetoolsCart): Cart => {
  const items = cart.lineItems.map((lineItem) => mapCartItem(lineItem));
  return {
    id: cart.id,
    version: cart.version,
    customerId: cart.customerId,
    items: items,
    totalItems: cart.totalLineItemQuantity ?? 0,
    subtotalPrice: items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    totalPrice: cart.totalPrice.centAmount / 100,
    currencyCode: cart.totalPrice.currencyCode,
    discountCodes: cart.discountCodes?.map((item) => item.discountCode.id) ?? [],
  };
};

export const mapCartItem = (lineItem: CommercetoolsLineItem): CartItem => {
  return {
    lineItemId: lineItem.id,
    productId: lineItem.productId,
    variantId: lineItem.variant.id,
    name: lineItem.name['en-US'] ?? '',
    imageUrl: lineItem.variant.images?.[0]?.url ?? '',
    unitPrice: lineItem.price.value.centAmount / 100,
    quantity: lineItem.quantity,
    totalPrice: lineItem.totalPrice.centAmount / 100,
    currencyCode: lineItem.totalPrice.currencyCode,
  };
};
