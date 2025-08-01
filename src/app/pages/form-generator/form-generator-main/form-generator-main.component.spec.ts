import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGeneratorMainComponent } from './form-generator-main.component';

describe('FormGeneratorMainComponent', () => {
  let component: FormGeneratorMainComponent;
  let fixture: ComponentFixture<FormGeneratorMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGeneratorMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormGeneratorMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
