import { Component, computed, inject, input } from '@angular/core';
import { ReviewsService } from '../services/reviews.service';
import { ReviewForm } from '../review-form/review-form';
import { ReviewCard } from '../review-card/review-card';
import { RawProductReview } from '../models/product-review.model';
import { CustomerService } from '../../auth/services/customer.service';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [ReviewForm, ReviewCard],
  templateUrl: './product-reviews-block.html',
  styleUrl: './product-reviews-block.scss',
})
export class ProductReviewsBlock {
  private readonly reviewsService = inject(ReviewsService);
  private readonly customerService = inject(CustomerService);

  readonly productId = input.required<string>();

  readonly userId = computed(() => this.customerService.user()?.id ?? '');
  readonly userName = computed(() => this.customerService.fullName());

  protected readonly reviews = computed(() => this.reviewsService.getReviews(this.productId())());

  protected addReview(review: RawProductReview): void {
    this.reviewsService.addReview({
      ...review,
      productId: this.productId(),
      userId: this.userId(),
      userName: this.userName(),
    });
  }
}
