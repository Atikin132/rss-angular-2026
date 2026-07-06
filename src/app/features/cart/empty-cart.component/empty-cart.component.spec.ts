import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyCartComponent } from './empty-cart.component';

describe('EmptyCartComponent', () => {
  let component: EmptyCartComponent;
  let fixture: ComponentFixture<EmptyCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyCartComponent],
    })
      .overrideComponent(EmptyCartComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EmptyCartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
