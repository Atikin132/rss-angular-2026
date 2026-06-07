import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPrice } from './product-price';

describe('ProductPrice', () => {
  let component: ProductPrice;
  let fixture: ComponentFixture<ProductPrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPrice],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductPrice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
