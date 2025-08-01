import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGeneratorDocComponent } from './form-generator-doc.component';

describe('FormGeneratorDocComponent', () => {
  let component: FormGeneratorDocComponent;
  let fixture: ComponentFixture<FormGeneratorDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGeneratorDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormGeneratorDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
