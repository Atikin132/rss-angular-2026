import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RatingStars } from '../rating-stars/rating-stars';
import { RawProductReview } from '../models/product-review.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RatingStars],
  templateUrl: './review-form.html',
  styleUrl: './review-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewForm {
  readonly reviewSubmitted = output<RawProductReview>();
  private cdr = inject(ChangeDetectorRef);

  protected readonly form = new FormGroup({
    rating: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.min(1)],
    }),

    comment: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(1000)],
    }),
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.reviewSubmitted.emit({
      rating: this.form.controls.rating.value,
      comment: this.form.controls.comment.value.trim(),
    });

    this.form.reset({
      rating: 0,
      comment: '',
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
