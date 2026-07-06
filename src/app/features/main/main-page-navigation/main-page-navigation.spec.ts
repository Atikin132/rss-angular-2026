import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageNavigation } from './main-page-navigation';

describe('MainPageNavigation', () => {
  let component: MainPageNavigation;
  let fixture: ComponentFixture<MainPageNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageNavigation],
    }).compileComponents();

    fixture = TestBed.createComponent(MainPageNavigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
