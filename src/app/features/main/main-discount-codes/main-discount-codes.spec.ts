import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDiscountCodes } from './main-discount-codes';

describe('MainDiscountCodes', () => {
  let component: MainDiscountCodes;
  let fixture: ComponentFixture<MainDiscountCodes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDiscountCodes],
    }).compileComponents();

    fixture = TestBed.createComponent(MainDiscountCodes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
