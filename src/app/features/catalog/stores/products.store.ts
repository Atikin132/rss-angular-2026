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
import { SortType } from '../sort/sort';

const BRAND_FACET_ENDPOINT = '&facet=variants.attributes.brand as brand';
const PRODUCTS_ENDPOINT = '/product-projections/search';
const CATEGORIES_ENDPOINT = '/categories';
export const PRODUCTS_ON_PAGE = 6;

interface ProductsState {
  products: Product[];
  categories: CategoryOption[];
  categoriesMap: Map<string, string>;
  brands: BrandOption[];
  filters: CatalogFilters;
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  sortType: SortType;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  categoriesMap: new Map(),
  brands: [],
  filters: {
    categories: [],
    brands: [],
    minPrice: null,
    maxPrice: null,
  },
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: PRODUCTS_ON_PAGE,
  searchQuery: '',
  sortType: 'name-asc',
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

function getSortParam(sortType: string): string {
  switch (sortType) {
    case 'name-asc':
      return 'name.en-US asc';
    case 'name-desc':
      return 'name.en-US desc';
    case 'price-asc':
      return 'price asc';
    case 'price-desc':
      return 'price desc';
    default:
      return 'name.en-US asc';
  }
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

export const ProductsStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store, apiService = inject(ApiService)) => ({
    async loadProducts() {
      await this.loadProductsPage(1, '', 'name-asc');
    },
    async loadProductsByFilters(filters: CatalogFilters) {
      patchState(store, { filters });
      await this.loadProductsPage(1, '', store.sortType());
    },
    async loadProductBySlug(slug: string): Promise<Product | null> {
      try {
        patchState(store, { loading: true, error: null });

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
          patchState(store, { error: 'Product not found' });
          return null;
        }

        return mapProduct(data.results[0], categoriesMap);
      } catch {
        patchState(store, { error: 'Failed to load product' });
        return null;
      } finally {
        patchState(store, { loading: false });
      }
    },
    async loadProductsPage(
      page = 1,
      search = '',
      sort: SortType = 'name-asc',
      clearFiltersOnSearch = true,
    ) {
      if (store.loading()) {
        return;
      }

      const pageSize = store.pageSize();
      const offset = (page - 1) * pageSize;

      try {
        patchState(store, {
          loading: true,
          error: null,
          currentPage: page,
          searchQuery: search,
          sortType: sort,
        });

        if (search.trim() && clearFiltersOnSearch) {
          const emptyFilters: CatalogFilters = {
            categories: [],
            brands: [],
            minPrice: null,
            maxPrice: null,
          };

          patchState(store, { filters: emptyFilters });
        }

        let endpoint = `${PRODUCTS_ENDPOINT}?limit=${pageSize}&offset=${offset}`;

        if (search.trim()) {
          endpoint += `&text.en-US="${encodeURIComponent(search.trim())}"`;
        }

        const sortParam = getSortParam(sort);
        endpoint += `&sort=${sortParam}`;

        const currentFilters = store.filters();
        const filterQuery = buildFilters(currentFilters);
        if (filterQuery) {
          endpoint += `&${filterQuery}`;
        }

        endpoint += BRAND_FACET_ENDPOINT;

        const data =
          await apiService.request<PagedResponse<CommercetoolsProductProjection>>(endpoint);

        const categoriesResult = await loadCategoriesIfNeeded(store.categories(), apiService);

        patchState(store, {
          products: data.results.map((p) =>
            mapProduct(p, categoriesResult?.categoriesMap ?? store.categoriesMap()),
          ),
          total: data.total ?? 0,
          brands: mapBrandFacets(data),
          ...(categoriesResult ?? {}),
        });
      } catch {
        patchState(store, { error: 'Failed to load products' });
      } finally {
        patchState(store, { loading: false });
      }
    },
    async loadProductsByIds(ids: string[]): Promise<Product[]> {
      if (!ids.length) {
        return [];
      }

      try {
        patchState(store, { loading: true, error: null });

        let categoriesMap = store.categoriesMap();
        const categoriesResult = await loadCategoriesIfNeeded(store.categories(), apiService);
        if (categoriesResult) {
          categoriesMap = categoriesResult.categoriesMap;
          patchState(store, categoriesResult);
        }
        const products = await Promise.all(
          ids.map((id) =>
            apiService.request<CommercetoolsProductProjection>(`/product-projections/${id}`),
          ),
        );
        return products.map((product) => mapProduct(product, categoriesMap));
      } catch {
        patchState(store, { error: 'Failed to load products' });
        return [];
      } finally {
        patchState(store, { loading: false });
      }
    },
  })),
);
