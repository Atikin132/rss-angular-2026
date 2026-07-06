import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { CartItem } from './interfaces/cart-item.interface';
import { CartService } from './services/cart.service';
import { CartPage } from './cart.page';

describe('CartPage', () => {
  let cartServiceMock: {
    items: ReturnType<typeof signal<CartItem[]>>;
    ensureCart: ReturnType<typeof vi.fn>;
    increaseQuantity: ReturnType<typeof vi.fn>;
    decreaseQuantity: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    clearCart: ReturnType<typeof vi.fn>;
  };
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;

  beforeEach(async () => {
    cartServiceMock = {
      items: signal<CartItem[]>([]),
      ensureCart: vi.fn().mockResolvedValue(undefined),
      increaseQuantity: vi.fn(),
      decreaseQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [
        {
          provide: CartService,
          useValue: cartServiceMock,
        },
      ],
    })
      .overrideComponent(CartPage, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
  });

  it('should create and ensure cart', () => {
    expect(component).toBeTruthy();
    expect(cartServiceMock.ensureCart).toHaveBeenCalledTimes(1);
  });

  it('should increase item quantity', () => {
    component.onIncrease('line-item-id');

    expect(cartServiceMock.increaseQuantity).toHaveBeenCalledWith('line-item-id');
  });

  it('should decrease item quantity', () => {
    component.onDecrease('line-item-id');

    expect(cartServiceMock.decreaseQuantity).toHaveBeenCalledWith('line-item-id');
  });

  it('should remove item', () => {
    component.onRemove('line-item-id');

    expect(cartServiceMock.removeItem).toHaveBeenCalledWith('line-item-id');
  });

  it('should clear cart', () => {
    component.onClearCart();

    expect(cartServiceMock.clearCart).toHaveBeenCalledTimes(1);
  });
});
