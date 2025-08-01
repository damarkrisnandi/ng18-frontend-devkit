import { Component, inject } from '@angular/core';
import { FormGeneratorMainComponent } from './form-generator-main/form-generator-main.component';
import { FormGeneratorStore } from './form-generator.store';
import { FormGeneratorPreviewComponent } from './form-generator-preview/form-generator-preview.component';
import { TabsModule } from 'primeng/tabs';
import { FormGeneratorDocComponent } from "./form-generator-doc/form-generator-doc.component";

@Component({
  selector: 'app-form-generator',
  standalone: true,
  imports: [FormGeneratorMainComponent, FormGeneratorPreviewComponent, TabsModule, FormGeneratorDocComponent],
  templateUrl: './form-generator.component.html',
  styleUrl: './form-generator.component.scss',
  providers: [
    FormGeneratorStore
  ]
})
export class FormGeneratorComponent {
  generatorStore = inject(FormGeneratorStore);
}
