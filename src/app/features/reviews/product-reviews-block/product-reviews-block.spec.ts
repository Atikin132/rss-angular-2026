import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReviewsBlock } from './product-reviews-block';

describe('ProductReviewsBlock', () => {
  let component: ProductReviewsBlock;
  let fixture: ComponentFixture<ProductReviewsBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReviewsBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductReviewsBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
