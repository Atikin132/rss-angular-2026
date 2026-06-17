import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ApiService } from '../../../core/services/commercetools/commercetools-api.service';
import { mapCategories, mapProduct } from '../../../core/services/commercetools/mapper';
import { Product } from '../models/product.model';
import {
  BrandOption,
  CategoryOption,
  CommercetoolsCategory,
  CommercetoolsProductProjection,
  PagedResponse,
} from '../../../core/services/commercetools/commercetools.types';
import { CatalogFilters } from '../filters/filters';
import { buildFilters } from '../utils/build-filters';

interface ProductsState {
  products: Product[];
  categories: CategoryOption[];
  categoriesMap: Map<string, string>;
  brands: BrandOption[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  categoriesMap: new Map(),
  brands: [],
  loading: false,
  error: null,
};

function mapCategoryOptions(categories: CommercetoolsCategory[]): CategoryOption[] {
  return categories
    .map((category) => ({
      id: category.id,
      name: category.name['en-US'],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function mapBrandFacets(productsData: PagedResponse<CommercetoolsProductProjection>) {
  return (
    productsData.facets?.['brand']?.terms?.map((term) => ({
      name: term.term,
      count: term.count,
    })) ?? []
  ).sort((a, b) => a.name.localeCompare(b.name));
}

async function loadCategoriesIfNeeded(
  categories: CategoryOption[],
  apiService: ApiService,
): Promise<{
  categories: CategoryOption[];
  categoriesMap: Map<string, string>;
} | null> {
  if (categories.length > 0) {
    return null;
  }

  const data = await apiService.request<PagedResponse<CommercetoolsCategory>>(CATEGORIES_ENDPOINT);

  return {
    categories: mapCategoryOptions(data.results),
    categoriesMap: mapCategories(data.results),
  };
}

const PRODUCTS_ENDPOINT = '/product-projections/search';
const PRODUCTS_LIMIT_PER_PAGE = '?limit=30';
const CATEGORIES_ENDPOINT = '/categories';
const BRAND_FACET_ENDPOINT = '&facet=variants.attributes.brand as brand';

export const ProductsStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

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
          PRODUCTS_ENDPOINT + PRODUCTS_LIMIT_PER_PAGE + BRAND_FACET_ENDPOINT,
        );

        const categoriesPromise = loadCategoriesIfNeeded(store.categories(), apiService);

        const [productsData, categoriesResult] = await Promise.all([
          productsPromise,
          categoriesPromise,
        ]);

        const categoriesMap = categoriesResult?.categoriesMap ?? store.categoriesMap();

        patchState(store, {
          products: productsData.results.map((product) => mapProduct(product, categoriesMap)),
          brands: mapBrandFacets(productsData),
          ...(categoriesResult ?? {}),
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
      try {
        patchState(store, {
          loading: true,
          error: null,
        });

        let categoriesMap = store.categoriesMap();

        const categoriesResult = await loadCategoriesIfNeeded(store.categories(), apiService);

        if (categoriesResult) {
          categoriesMap = categoriesResult.categoriesMap;

          patchState(store, categoriesResult);
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
    async loadProductsByFilters(filters: CatalogFilters) {
      try {
        patchState(store, {
          loading: true,
          error: null,
        });

        const query = buildFilters(filters);

        const data = await apiService.request<PagedResponse<CommercetoolsProductProjection>>(
          `${PRODUCTS_ENDPOINT}?limit=30&${query}`,
        );

        patchState(store, {
          products: data.results.map((p) => mapProduct(p, store.categoriesMap())),
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
  })),
);
