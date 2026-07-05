import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Cart } from '../interfaces/cart.interface';
import { CommercetoolsCart } from '../../../core/services/commercetools/commercetools.types';
import { CartService } from './cart.service';
import { SUPPRESS_ERROR_TOAST } from '../../../core/interceptors/error.interceptor';

describe('CartService', () => {
  let service: CartService;
  let httpMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
  };

  const commercetoolsCartMock: CommercetoolsCart = {
    id: 'cart-id',
    version: 1,
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

  const cartMock: Cart = {
    id: 'cart-id',
    version: 1,
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
  };

  beforeEach(() => {
    httpMock = {
      get: vi.fn(),
      post: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CartService,
        {
          provide: HttpClient,
          useValue: httpMock,
        },
      ],
    });

    sessionStorage.setItem('accessToken', 'token');
    sessionStorage.setItem('scope', 'manage_my_orders:project customer_id:customer-id');
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should expose empty cart defaults', () => {
    expect(service.items()).toEqual([]);
    expect(service.totalItems()).toBe(0);
    expect(service.subtotalPrice()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('should return existing cart without request', async () => {
    service.cart.set(cartMock);

    const cart = await service.ensureCart();

    expect(cart).toEqual(cartMock);
    expect(httpMock.get).not.toHaveBeenCalled();
  });

  it('should load active cart', async () => {
    httpMock.get.mockReturnValue(of(commercetoolsCartMock));

    const cart = await service.ensureCart();

    expect(cart.id).toBe('cart-id');
    expect(service.totalItems()).toBe(2);
    expect(httpMock.get).toHaveBeenCalledWith(expect.stringContaining('/active-cart'), {
      context: expect.anything(),
      headers: {
        Authorization: 'Bearer token',
      },
    });
    const [, options] = httpMock.get.mock.calls[0];

    expect(options.context.get(SUPPRESS_ERROR_TOAST)(new HttpErrorResponse({ status: 404 }))).toBe(
      true,
    );
  });

  it('should create cart when active cart is not found', async () => {
    httpMock.get.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    httpMock.post.mockReturnValue(of(commercetoolsCartMock));

    const cart = await service.ensureCart();

    expect(cart.id).toBe('cart-id');
    expect(httpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('/carts'),
      { currency: 'USD' },
      expect.any(Object),
    );
  });

  it('should increase item quantity', async () => {
    service.cart.set(cartMock);
    httpMock.post.mockReturnValue(of(commercetoolsCartMock));

    await service.increaseQuantity('line-item-id');

    expect(httpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('/carts/cart-id'),
      {
        version: 1,
        actions: [
          {
            action: 'changeLineItemQuantity',
            lineItemId: 'line-item-id',
            quantity: 3,
          },
        ],
      },
      expect.any(Object),
    );
  });

  it('should decrease item quantity', async () => {
    service.cart.set(cartMock);
    httpMock.post.mockReturnValue(of(commercetoolsCartMock));

    await service.decreaseQuantity('line-item-id');

    expect(httpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('/carts/cart-id'),
      expect.objectContaining({
        actions: [
          {
            action: 'changeLineItemQuantity',
            lineItemId: 'line-item-id',
            quantity: 1,
          },
        ],
      }),
      expect.any(Object),
    );
  });

  it('should remove item', async () => {
    service.cart.set(cartMock);
    httpMock.post.mockReturnValue(of(commercetoolsCartMock));

    await service.removeItem('line-item-id');

    expect(httpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('/carts/cart-id'),
      expect.objectContaining({
        actions: [
          {
            action: 'removeLineItem',
            lineItemId: 'line-item-id',
          },
        ],
      }),
      expect.any(Object),
    );
  });

  it('should add product to cart', async () => {
    service.cart.set(cartMock);
    httpMock.post.mockReturnValue(of(commercetoolsCartMock));

    await service.addToCart('product-id', 2);

    expect(httpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('/carts/cart-id'),
      expect.objectContaining({
        actions: [
          {
            action: 'addLineItem',
            productId: 'product-id',
            variantId: 2,
            quantity: 1,
          },
        ],
      }),
      expect.any(Object),
    );
  });

  it('should apply trimmed promo code', async () => {
    service.cart.set(cartMock);
    httpMock.post.mockReturnValue(of(commercetoolsCartMock));

    await service.applyPromoCode(' SAVE10 ');

    expect(httpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('/carts/cart-id'),
      expect.objectContaining({
        actions: [
          {
            action: 'addDiscountCode',
            code: 'SAVE10',
          },
        ],
      }),
      expect.any(Object),
    );
  });

  it('should not apply empty promo code', async () => {
    await service.applyPromoCode('   ');

    expect(httpMock.post).not.toHaveBeenCalled();
  });

  it('should clear cart items and discounts', async () => {
    service.cart.set(cartMock);
    httpMock.post.mockReturnValue(of(commercetoolsCartMock));

    await service.clearCart();

    expect(httpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('/carts/cart-id'),
      expect.objectContaining({
        actions: [
          {
            action: 'removeLineItem',
            lineItemId: 'line-item-id',
          },
          {
            action: 'removeDiscountCode',
            discountCode: {
              typeId: 'discount-code',
              id: 'discount-id',
            },
          },
        ],
      }),
      expect.any(Object),
    );
  });
});
