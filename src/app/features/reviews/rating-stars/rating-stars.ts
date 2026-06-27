import { Component, model, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './rating-stars.html',
  styleUrl: './rating-stars.scss',
})
export class RatingStars {
  readonly rating = model(0);
  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly hoveredStar = signal<number | null>(null);

  protected selectRating(star: number): void {
    this.rating.set(star);
  }

  protected hoverStar(star: number): void {
    this.hoveredStar.set(star);
  }

  protected leaveStars(): void {
    this.hoveredStar.set(null);
  }

  protected isFilled(star: number): boolean {
    const hovered = this.hoveredStar();

    if (hovered !== null) {
      return star <= hovered;
    }

    return star <= this.rating();
  }
}
