import { computed, Injectable, signal } from '@angular/core';
import { ProductReview, CreateProductReview } from '../models/product-review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private readonly STORAGE_KEY = 'reviews';

  private readonly reviews = signal<ProductReview[]>([]);

  constructor() {
    this.load();
  }

  getReviews(productId: string) {
    return computed(() => this.reviews().filter((review) => review.productId === productId));
  }

  addReview(review: CreateProductReview): void {
    const reviews = this.reviews();

    const existingIndex = reviews.findIndex(
      (item) => item.productId === review.productId && item.userId === review.userId,
    );

    if (existingIndex !== -1) {
      const updatedReviews = [...reviews];

      updatedReviews[existingIndex] = {
        ...updatedReviews[existingIndex],
        rating: review.rating,
        comment: review.comment,
        createdAt: new Date().toISOString(),
      };

      this.reviews.set(updatedReviews);
    } else {
      this.reviews.update((reviews) => [
        ...reviews,
        {
          ...review,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    this.save();
  }

  getAverageRating(productId: string): number {
    const reviews = this.reviews().filter((review) => review.productId === productId);

    if (!reviews.length) {
      return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    return totalRating / reviews.length;
  }

  getReviewsCount(productId: string): number {
    return this.reviews().filter((review) => review.productId === productId).length;
  }

  private load(): void {
    const raw = localStorage.getItem(this.STORAGE_KEY);

    if (!raw) {
      return;
    }

    this.reviews.set(JSON.parse(raw) as ProductReview[]);
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reviews()));
  }
}
