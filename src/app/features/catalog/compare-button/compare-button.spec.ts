import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareButton } from './compare-button';

describe('CompareButton', () => {
  let component: CompareButton;
  let fixture: ComponentFixture<CompareButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareButton],
    }).compileComponents();

    fixture = TestBed.createComponent(CompareButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
