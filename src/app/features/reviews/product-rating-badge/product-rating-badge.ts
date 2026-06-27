import { Component, computed, inject, input } from '@angular/core';
import { ReviewsService } from '../services/reviews.service';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-rating-badge',
  standalone: true,
  imports: [MatIconModule, DecimalPipe],
  templateUrl: './product-rating-badge.html',
  styleUrl: './product-rating-badge.scss',
})
export class ProductRatingBadge {
  private readonly reviewsService = inject(ReviewsService);

  readonly productId = input.required<string>();

  readonly rating = computed(() => this.reviewsService.getAverageRating(this.productId()));

  readonly count = computed(() => this.reviewsService.getReviewsCount(this.productId()));

  readonly hasRating = computed(() => this.count() > 0);

  protected readonly stars = computed(() => {
    const avg = this.rating();
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return starValue <= Math.round(avg);
    });
  });
}
