import { effect } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

function safeLoadArray(storageKey: string): string[] {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function createSelectionStore(storageKey: string) {
  return signalStore(
    { providedIn: 'root' },

    withState<{ productIds: string[] }>(() => ({
      productIds: safeLoadArray(storageKey),
    })),

    withMethods((store) => ({
      toggle(productId: string) {
        const list = store.productIds();
        const exists = list.includes(productId);

        patchState(store, {
          productIds: exists ? list.filter((id) => id !== productId) : [...list, productId],
        });
      },

      add(productId: string) {
        const list = store.productIds();
        if (list.includes(productId)) return;

        patchState(store, {
          productIds: [...list, productId],
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
          localStorage.setItem(storageKey, JSON.stringify(store.productIds()));
        });
      },
    }),
  );
}

export const CompareStore = createSelectionStore('compare');
export const CartStore = createSelectionStore('cart');
export const WishlistStore = createSelectionStore('wishlist');
