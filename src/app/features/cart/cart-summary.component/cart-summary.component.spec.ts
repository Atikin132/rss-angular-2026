import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { CartService } from '../services/cart.service';
import { CartSummaryComponent } from './cart-summary.component';

describe('CartSummaryComponent', () => {
  let cartServiceMock: {
    totalPrice: ReturnType<typeof signal<number>>;
    subtotalPrice: ReturnType<typeof signal<number>>;
    applyPromoCode: ReturnType<typeof vi.fn>;
  };
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;

  beforeEach(async () => {
    cartServiceMock = {
      totalPrice: signal(80),
      subtotalPrice: signal(100),
      applyPromoCode: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent],
      providers: [
        {
          provide: CartService,
          useValue: cartServiceMock,
        },
      ],
    })
      .overrideComponent(CartSummaryComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose cart prices', () => {
    expect(component.subtotalPrice()).toBe(100);
    expect(component.totalPrice()).toBe(80);
  });

  it('should apply promo code and clear input', async () => {
    component.promoCode.set('SAVE10');

    await component.onApplyPromoCode();

    expect(cartServiceMock.applyPromoCode).toHaveBeenCalledWith('SAVE10');
    expect(component.promoCode()).toBe('');
  });
});
