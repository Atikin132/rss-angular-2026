import { Component, computed, inject, OnInit } from '@angular/core';
import { ProductGrid } from '../catalog/product-grid/product-grid';
import { WishlistStore } from '../catalog/stores/create-selection.store';
import { ProductsStore } from '../catalog/stores/products.store';

@Component({
  selector: 'app-wishlist',
  imports: [ProductGrid],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class WishlistPage implements OnInit {
  private wishlistStore = inject(WishlistStore);
  private productsStore = inject(ProductsStore);

  wishlistProducts = computed(() => {
    const ids = this.wishlistStore.productIds();
    const allProducts = this.productsStore.products();
    return allProducts.filter((product) => ids.includes(product.id));
  });

  ngOnInit() {
    if (this.productsStore.products().length === 0) {
      this.productsStore.loadProducts();
    }
  }
}
