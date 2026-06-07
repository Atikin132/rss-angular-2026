import { effect } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

const STORAGE_KEY = 'cart';

function safeLoadCart(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

interface CartState {
  productIds: string[];
}

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState<CartState>(() => ({
    productIds: safeLoadCart(),
  })),

  withMethods((store) => ({
    toggle(productId: string) {
      const productIds = store.productIds();
      const exists = productIds.includes(productId);

      patchState(store, {
        productIds: exists
          ? productIds.filter((id) => id !== productId)
          : [...productIds, productId],
      });
    },

    add(productId: string) {
      const productIds = store.productIds();
      if (productIds.includes(productId)) return;

      patchState(store, {
        productIds: [...productIds, productId],
      });
    },

    remove(productId: string) {
      patchState(store, {
        productIds: store.productIds().filter((id) => id !== productId),
      });
    },

    clear() {
      patchState(store, {
        productIds: [],
      });
    },
  })),

  withHooks({
    onInit(store) {
      effect(() => {
        const ids = store.productIds();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      });
    },
  }),
);
