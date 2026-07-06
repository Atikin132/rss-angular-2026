import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { CartItem } from '../interfaces/cart-item.interface';
import { CartItemComponent } from './cart-item.component';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  const itemMock: CartItem = {
    lineItemId: 'line-item-id',
    productId: 'product-id',
    variantId: 1,
    name: 'Keyboard',
    imageUrl: 'image.jpg',
    unitPrice: 10,
    quantity: 2,
    totalPrice: 20,
    currencyCode: 'USD',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemComponent],
    })
      .overrideComponent(CartItemComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', itemMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit increase event with line item id', () => {
    const emitSpy = vi.spyOn(component.increase, 'emit');

    component.onIncrease();

    expect(emitSpy).toHaveBeenCalledWith('line-item-id');
  });

  it('should emit decrease event with line item id', () => {
    const emitSpy = vi.spyOn(component.decrease, 'emit');

    component.onDecrease();

    expect(emitSpy).toHaveBeenCalledWith('line-item-id');
  });

  it('should emit remove event with line item id', () => {
    const emitSpy = vi.spyOn(component.remove, 'emit');

    component.onRemove();

    expect(emitSpy).toHaveBeenCalledWith('line-item-id');
  });
});
