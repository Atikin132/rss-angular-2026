import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly itemsState = signal<CartItem[]>([
    {
      id: '1',
      name: 'Wireless Headphones',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      price: 199,
      quantity: 1,
    },
    {
      id: '2',
      name: 'Mechanical Keyboard',
      imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae',
      price: 149,
      quantity: 2,
    },
  ]);

  readonly items = this.itemsState.asReadonly();
  readonly totalItems = computed(() =>
    this.itemsState().reduce((total, item) => total + item.quantity, 0),
  );
  readonly totalPrice = computed(() =>
    this.itemsState().reduce((total, item) => total + item.price * item.quantity, 0),
  );

  increaseQuantity(id: string): void {
    this.itemsState.update((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
    );
  }

  decreaseQuantity(id: string): void {
    this.itemsState.update((items) =>
      items
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  removeItem(id: string): void {
    this.itemsState.update((items) => items.filter((item) => item.id !== id));
  }

  clearCart(): void {
    this.itemsState.set([]);
  }
}
