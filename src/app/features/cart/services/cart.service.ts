import { computed, inject, Injectable, signal } from '@angular/core';
import { Cart } from '../interfaces/cart.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CommercetoolsCart,
  CommercetoolsCartUpdateAction,
} from '../../../core/services/commercetools/commercetools.types';
import { mapCart } from '../mappers/cart.mapper';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly http = inject(HttpClient);
  readonly baseUrl = `${environment.commercetools.apiUrl}/${environment.commercetools.projectKey}/me`;
  isLoading = signal(false);
  errorMessage = signal(false);
  cart = signal<Cart | null>(null);

  readonly items = computed(() => {
    return this.cart()?.items ?? [];
  });
  readonly totalPrice = computed(() => {
    return this.cart()?.totalPrice ?? 0;
  });
  readonly totalItems = computed(() => {
    return this.cart()?.totalItems ?? 0;
  });

  private getCustomerToken(): string {
    const token = sessionStorage.getItem('accessToken') ?? localStorage.getItem('accessToken');
    const scope = sessionStorage.getItem('scope') ?? localStorage.getItem('scope');

    if (!token) {
      throw new Error('Customer access token not found');
    }

    if (!scope?.includes('manage_my_orders') || !scope.includes('customer_id:')) {
      throw new Error(`Customer token has insufficient scope: ${scope ?? 'empty'}`);
    }

    return token;
  }

  async ensureCart(): Promise<Cart> {
    const currentCart = this.cart();
    if (currentCart) {
      return currentCart;
    }
    const token = this.getCustomerToken();
    try {
      const activeCart = await firstValueFrom(
        this.http.get<CommercetoolsCart>(`${this.baseUrl}/active-cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      const mappedCart = mapCart(activeCart);
      this.cart.set(mappedCart);
      return mappedCart;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        return this.createCart();
      }

      throw error;
    }
  }
  async createCart(): Promise<Cart> {
    const token = this.getCustomerToken();
    const newCart = await firstValueFrom(
      this.http.post<CommercetoolsCart>(
        `${this.baseUrl}/carts`,
        { currency: 'USD' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
    const mappedCart = mapCart(newCart);
    this.cart.set(mappedCart);
    return mappedCart;
  }
  private async updateCart(actions: CommercetoolsCartUpdateAction[]): Promise<Cart> {
    const token = this.getCustomerToken();
    const currentCart = await this.ensureCart();
    const updatedCart = await firstValueFrom(
      this.http.post<CommercetoolsCart>(
        `${this.baseUrl}/carts/${currentCart.id}`,
        {
          version: currentCart.version,
          actions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
    const mappedCart = mapCart(updatedCart);
    this.cart.set(mappedCart);
    return mappedCart;
  }
  async increaseQuantity(lineItemId: string): Promise<void> {
    const item = this.items().find((item) => item.lineItemId === lineItemId);
    if (!item) {
      throw new Error(`Cart item with id "${lineItemId}" not found`);
    }

    await this.updateCart([
      {
        action: 'changeLineItemQuantity',
        lineItemId,
        quantity: item.quantity + 1,
      },
    ]);
  }
  async decreaseQuantity(lineItemId: string): Promise<void> {
    const item = this.items().find((item) => item.lineItemId === lineItemId);
    if (!item) {
      throw new Error(`Cart item with id "${lineItemId}" not found`);
    }
    if (item.quantity <= 1) {
      await this.removeItem(lineItemId);
      return;
    }

    await this.updateCart([
      {
        action: 'changeLineItemQuantity',
        lineItemId,
        quantity: item.quantity - 1,
      },
    ]);
  }
  async removeItem(lineItemId: string): Promise<void> {
    const item = this.items().find((item) => item.lineItemId === lineItemId);
    if (!item) {
      throw new Error(`Cart item with id "${lineItemId}" not found`);
    }
    await this.updateCart([
      {
        action: 'removeLineItem',
        lineItemId,
      },
    ]);
    return;
  }
  async addToCart(productId: string, variantId = 1): Promise<void> {
    await this.updateCart([
      {
        action: 'addLineItem',
        productId,
        variantId,
        quantity: 1,
      },
    ]);
  }
  async clearCart(): Promise<void> {
    const items = this.items();

    if (!items.length) {
      return;
    }

    await this.updateCart(
      items.map((item) => ({
        action: 'removeLineItem',
        lineItemId: item.lineItemId,
      })),
    );
  }
  async removeFromCartByProductId(productId: string): Promise<void> {
    const item = this.items().find((item) => item.productId === productId);

    if (!item) {
      return;
    }

    await this.removeItem(item.lineItemId);
  }
}
