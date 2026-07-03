import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNewArrivals } from './main-new-arrivals';

describe('MainNewArrivals', () => {
  let component: MainNewArrivals;
  let fixture: ComponentFixture<MainNewArrivals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainNewArrivals],
    }).compileComponents();

    fixture = TestBed.createComponent(MainNewArrivals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
