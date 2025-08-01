import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsContainerComponent } from './docs-container.component';

describe('DocsContainerComponent', () => {
  let component: DocsContainerComponent;
  let fixture: ComponentFixture<DocsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
