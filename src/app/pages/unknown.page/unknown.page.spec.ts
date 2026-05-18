import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownPage } from './unknown.page';

describe('UnknownPage', () => {
  let component: UnknownPage;
  let fixture: ComponentFixture<UnknownPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnknownPage],
    }).compileComponents();

    fixture = TestBed.createComponent(UnknownPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
