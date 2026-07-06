import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductGrid } from '../catalog/product-grid/product-grid';
import { WishlistStore } from '../catalog/stores/create-selection.store';
import { ProductsStore } from '../catalog/stores/products.store';
import { Product } from '../catalog/models/product.model';
import { Loader } from '../../shared/components/loader/loader';

@Component({
  selector: 'app-wishlist',
  imports: [ProductGrid, Loader],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class WishlistPage implements OnInit {
  private wishlistStore = inject(WishlistStore);
  private productsStore = inject(ProductsStore);

  loading = this.productsStore.loading;

  wishlistProducts = signal<Product[]>([]);

  async ngOnInit() {
    const ids = this.wishlistStore.productIds();
    this.wishlistProducts.set(await this.productsStore.loadProductsByIds(ids));
  }
}
