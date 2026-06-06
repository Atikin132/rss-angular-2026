import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBreadcrumbs } from './product-breadcrumbs';

describe('ProductBreadcrumbs', () => {
  let component: ProductBreadcrumbs;
  let fixture: ComponentFixture<ProductBreadcrumbs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductBreadcrumbs],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductBreadcrumbs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
