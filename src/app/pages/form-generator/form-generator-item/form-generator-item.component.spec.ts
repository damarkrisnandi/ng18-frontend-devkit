import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGeneratorItemComponent } from './form-generator-item.component';

describe('FormGeneratorItemComponent', () => {
  let component: FormGeneratorItemComponent;
  let fixture: ComponentFixture<FormGeneratorItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGeneratorItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormGeneratorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
