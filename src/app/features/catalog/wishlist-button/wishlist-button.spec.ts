import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistButton } from './wishlist-button';

describe('WishlistButton', () => {
  let component: WishlistButton;
  let fixture: ComponentFixture<WishlistButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistButton],
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
