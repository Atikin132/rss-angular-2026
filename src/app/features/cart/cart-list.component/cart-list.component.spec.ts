import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { CartItem } from '../interfaces/cart-item.interface';
import { CartListComponent } from './cart-list.component';

describe('CartListComponent', () => {
  let component: CartListComponent;
  let fixture: ComponentFixture<CartListComponent>;

  const itemsMock: CartItem[] = [
    {
      lineItemId: 'line-item-id',
      productId: 'product-id',
      variantId: 1,
      name: 'Keyboard',
      imageUrl: 'image.jpg',
      unitPrice: 10,
      quantity: 2,
      totalPrice: 20,
      currencyCode: 'USD',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartListComponent],
    })
      .overrideComponent(CartListComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CartListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', itemsMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit increase event', () => {
    const emitSpy = vi.spyOn(component.increase, 'emit');

    component.onIncrease('line-item-id');

    expect(emitSpy).toHaveBeenCalledWith('line-item-id');
  });

  it('should emit decrease event', () => {
    const emitSpy = vi.spyOn(component.decrease, 'emit');

    component.onDecrease('line-item-id');

    expect(emitSpy).toHaveBeenCalledWith('line-item-id');
  });

  it('should emit remove event', () => {
    const emitSpy = vi.spyOn(component.remove, 'emit');

    component.onRemove('line-item-id');

    expect(emitSpy).toHaveBeenCalledWith('line-item-id');
  });
});
