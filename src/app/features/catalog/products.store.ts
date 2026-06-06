import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ApiService } from '../../core/services/commercetools/commercetools-api.service';
import { mapProduct } from '../../core/services/commercetools/mapper';
import { Product } from './models/product.model';
import {
  CommercetoolsProductProjection,
  PagedResponse,
} from '../../core/services/commercetools/commercetools.types';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

const PRODUCTS_ENDPOINT = '/product-projections?limit=50&expand=categories[*]';

export const ProductsStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    categories: computed(() => {
      return [...new Set(store.products().map((p) => p.category))].sort();
    }),

    brands: computed(() => {
      return [...new Set(store.products().map((p) => p.brand))].sort();
    }),
  })),

  withMethods((store, apiService = inject(ApiService)) => ({
    async loadProducts() {
      if (store.loading()) {
        return;
      }
      try {
        patchState(store, {
          loading: true,
          error: null,
        });

        const data =
          await apiService.request<PagedResponse<CommercetoolsProductProjection>>(
            PRODUCTS_ENDPOINT,
          );

        patchState(store, {
          products: data.results.map(mapProduct),
        });
      } catch {
        patchState(store, {
          error: 'Failed to load products',
        });
      } finally {
        patchState(store, {
          loading: false,
        });
      }
    },
    async loadProductBySlug(slug: string): Promise<Product | null> {
      const existingProduct = store.products().find((product) => product.slug === slug);
      if (existingProduct) {
        return existingProduct;
      }
      try {
        patchState(store, {
          loading: true,
          error: null,
        });

        const data = await apiService.request<PagedResponse<CommercetoolsProductProjection>>(
          `/product-projections?where=slug(en-US="${slug}")&limit=1&expand=categories[*]`,
        );
        const product = mapProduct(data.results[0]);

        if (!product) {
          patchState(store, {
            error: 'Product not found',
          });
          return null;
        }
        return product;
      } catch {
        patchState(store, {
          error: 'Failed to load product',
        });
        return null;
      } finally {
        patchState(store, {
          loading: false,
        });
      }
    },
  })),
);
