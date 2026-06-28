import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCategoryNavigation } from './main-category-navigation';

describe('MainCategoryNavigation', () => {
  let component: MainCategoryNavigation;
  let fixture: ComponentFixture<MainCategoryNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCategoryNavigation],
    }).compileComponents();

    fixture = TestBed.createComponent(MainCategoryNavigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
