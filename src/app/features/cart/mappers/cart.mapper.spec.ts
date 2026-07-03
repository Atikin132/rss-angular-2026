import { CommercetoolsCart } from '../../../core/services/commercetools/commercetools.types';
import { mapCart, mapCartItem } from './cart.mapper';

describe('cart mapper', () => {
  const commercetoolsCartMock: CommercetoolsCart = {
    id: 'cart-id',
    version: 2,
    customerId: 'customer-id',
    totalLineItemQuantity: 2,
    totalPrice: {
      centAmount: 2000,
      currencyCode: 'USD',
    },
    discountCodes: [
      {
        discountCode: {
          id: 'discount-id',
        },
      },
    ],
    lineItems: [
      {
        id: 'line-item-id',
        productId: 'product-id',
        name: {
          'en-US': 'Keyboard',
        },
        variant: {
          id: 1,
          sku: 'keyboard-sku',
          images: [
            {
              url: 'image.jpg',
            },
          ],
        },
        price: {
          value: {
            centAmount: 1000,
            currencyCode: 'USD',
          },
        },
        quantity: 2,
        totalPrice: {
          centAmount: 2000,
          currencyCode: 'USD',
        },
      },
    ],
  };

  it('should map cart item', () => {
    expect(mapCartItem(commercetoolsCartMock.lineItems[0])).toEqual({
      lineItemId: 'line-item-id',
      productId: 'product-id',
      variantId: 1,
      name: 'Keyboard',
      imageUrl: 'image.jpg',
      unitPrice: 10,
      quantity: 2,
      totalPrice: 20,
      currencyCode: 'USD',
    });
  });

  it('should map cart totals and discount codes', () => {
    expect(mapCart(commercetoolsCartMock)).toEqual({
      id: 'cart-id',
      version: 2,
      customerId: 'customer-id',
      items: [
        {
          lineItemId: 'line-item-id',
          productId: 'product-id',
          variantId: 1,
          name: 'Keyboard',
          imageUrl: 'image.jpg',
          unitPrice: 10,
          quantity: 2,
          totalPrice: 20,
          currencyCode: 'USD',
        },
      ],
      totalItems: 2,
      subtotalPrice: 20,
      totalPrice: 20,
      currencyCode: 'USD',
      discountCodes: ['discount-id'],
    });
  });
});
