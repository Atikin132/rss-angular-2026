import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartBadgeComponent } from './cart-badge.component';

describe('CartBadgeComponent', () => {
  let component: CartBadgeComponent;
  let fixture: ComponentFixture<CartBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartBadgeComponent],
      providers: [
        {
          provide: CartService,
          useValue: {
            totalItems: signal(3),
          },
        },
      ],
    })
      .overrideComponent(CartBadgeComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CartBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose cart items count', () => {
    expect(component.count()).toBe(3);
  });
});
