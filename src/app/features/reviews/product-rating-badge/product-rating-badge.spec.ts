import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRatingBadge } from './product-rating-badge';

describe('ProductRatingBadge', () => {
  let component: ProductRatingBadge;
  let fixture: ComponentFixture<ProductRatingBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRatingBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRatingBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
