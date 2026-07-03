import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProductReview } from '../models/product-review.model';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './review-card.html',
  styleUrl: './review-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCard {
  readonly review = input.required<ProductReview>();

  protected stars = [1, 2, 3, 4, 5];

  protected isFilled(star: number): boolean {
    return star <= this.review().rating;
  }

  protected formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
