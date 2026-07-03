import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPage } from './about.page';

describe('AboutPage', () => {
  let component: AboutPage;
  let fixture: ComponentFixture<AboutPage>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the intro title and description', () => {
    const title = compiled.querySelector('#about-title');
    const intro = compiled.querySelector('.intro-content p');

    expect(title?.textContent?.trim()).toBe('Redefining Digital Commerce');
    expect(intro?.textContent).toContain('NovaKrama was born from a vision');
  });

  it('should render team member cards', () => {
    const cards = compiled.querySelectorAll('.team .card');

    expect(cards.length).toBe(4);
    expect(compiled.textContent).toContain('RS School Mentor');
    expect(compiled.textContent).toContain('Mikita Atikin');
    expect(compiled.textContent).toContain('Artur Agtugchik');
    expect(compiled.textContent).toContain('Kostev Oleg');
  });

  it('should render collaboration practices', () => {
    const practices = compiled.querySelectorAll('.practices li');

    expect(practices.length).toBe(2);
    expect(compiled.textContent).toContain('Continuous Integration');
    expect(compiled.textContent).toContain('Async Communication');
  });

  it('should render powered by tools', () => {
    const tools = Array.from(compiled.querySelectorAll('.tools span')).map((tool) =>
      tool.textContent?.trim(),
    );

    expect(tools).toEqual(['RS School', 'Material 3', 'Angular', 'GitHub']);
  });
});
