import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ApiService } from '../../../core/services/commercetools/commercetools-api.service';
import { mapCategories, mapProduct } from '../../../core/services/commercetools/mapper';
import { Product } from '../models/product.model';
import {
  CommercetoolsCategory,
  CommercetoolsProductProjection,
  PagedResponse,
} from '../../../core/services/commercetools/commercetools.types';

interface ProductsState {
  products: Product[];
  categories: string[];
  categoriesMap: Map<string, string>;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  categoriesMap: new Map(),
  loading: false,
  error: null,
};

const PRODUCTS_ENDPOINT = '/product-projections/search';
const PRODUCTS_LIMIT_PER_PAGE = '?limit=30';
const CATEGORIES_ENDPOINT = '/categories';

export const ProductsStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
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

        const productsPromise = apiService.request<PagedResponse<CommercetoolsProductProjection>>(
          PRODUCTS_ENDPOINT + PRODUCTS_LIMIT_PER_PAGE,
        );

        const categoriesPromise =
          store.categoriesMap().size > 0
            ? Promise.resolve(null)
            : apiService.request<PagedResponse<CommercetoolsCategory>>(CATEGORIES_ENDPOINT);

        const [productsData, categoriesData] = await Promise.all([
          productsPromise,
          categoriesPromise,
        ]);

        const categoriesMap =
          categoriesData !== null ? mapCategories(categoriesData.results) : store.categoriesMap();

        patchState(store, {
          categoriesMap,
          categories: [...categoriesMap.values()].sort(),
          products: productsData.results.map((product) => mapProduct(product, categoriesMap)),
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

        let categoriesMap = store.categoriesMap();

        if (categoriesMap.size === 0) {
          const categoriesData =
            await apiService.request<PagedResponse<CommercetoolsCategory>>(CATEGORIES_ENDPOINT);

          categoriesMap = mapCategories(categoriesData.results);

          patchState(store, {
            categoriesMap,
          });
        }

        const data = await apiService.request<PagedResponse<CommercetoolsProductProjection>>(
          `${PRODUCTS_ENDPOINT}?filter=slug.en-US:"${slug}"&limit=1`,
        );

        if (!data.results.length) {
          patchState(store, {
            error: 'Product not found',
          });

          return null;
        }

        return mapProduct(data.results[0], categoriesMap);
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
