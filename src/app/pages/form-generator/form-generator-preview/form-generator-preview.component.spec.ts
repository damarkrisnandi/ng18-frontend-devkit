import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGeneratorPreviewComponent } from './form-generator-preview.component';

describe('FormGeneratorPreviewComponent', () => {
  let component: FormGeneratorPreviewComponent;
  let fixture: ComponentFixture<FormGeneratorPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGeneratorPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormGeneratorPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
