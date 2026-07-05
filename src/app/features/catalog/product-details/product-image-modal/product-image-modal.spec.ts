import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageModal } from './product-image-modal';

describe('ProductImageModal', () => {
  let component: ProductImageModal;
  let fixture: ComponentFixture<ProductImageModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductImageModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductImageModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
