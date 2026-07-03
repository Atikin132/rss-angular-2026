import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { ProfileService } from '../services/profile.service';
import { ProfilePage } from './profile.page';

describe('ProfilePage', () => {
  let profileServiceMock: {
    user: ReturnType<typeof signal>;
    errorMessage: ReturnType<typeof signal<string>>;
    loadUser: ReturnType<typeof vi.fn>;
  };
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async () => {
    profileServiceMock = {
      user: signal(null),
      errorMessage: signal(''),
      loadUser: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        {
          provide: ProfileService,
          useValue: profileServiceMock,
        },
      ],
    })
      .overrideComponent(ProfilePage, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    component.ngOnInit();

    expect(profileServiceMock.loadUser).toHaveBeenCalledTimes(1);
  });
});
