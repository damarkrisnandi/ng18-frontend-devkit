import { Component, computed, inject } from '@angular/core';
import { FormGeneratorStore } from '../form-generator.store';
import { FormGeneratorItemComponent } from '../form-generator-item/form-generator-item.component';

@Component({
  selector: 'app-form-generator-preview',
  standalone: true,
  imports: [FormGeneratorItemComponent],
  templateUrl: './form-generator-preview.component.html',
  styleUrl: './form-generator-preview.component.scss'
})
export class FormGeneratorPreviewComponent {
  generatorStore = inject(FormGeneratorStore);

  cols = computed(() => Array.from({ length: this.generatorStore.$formGenerator().grid.column ?? 0 }, (_, index: number) => {
    let styleClass = 'col-span-12 md:col-span-6 grid gap-2';
    switch (this.generatorStore.$formGenerator().grid.column) {
      case 1:
        styleClass = 'col-span-12 md:col-span-12 grid gap-2'
        break;
      case 2:
        styleClass = 'col-span-12 md:col-span-6 grid gap-2'
        break;
      case 3:
        styleClass = 'col-span-12 md:col-span-4 grid gap-2'
        break;
      case 4:
        styleClass = 'col-span-12 md:col-span-3 grid gap-2'
        break;
      case 6:
        styleClass = 'col-span-12 md:col-span-3 grid gap-2'
        break;

      default:
        styleClass = 'col-span-12 md:col-span-12 grid gap-2'
        break;
    }

    return { name: `col-${index}`, styleClass }
  }))
  rows = computed(() => Array.from({ length: this.generatorStore.$formGenerator().grid.row ?? 0 }, (_, index: number) => {
    return { name: `row-${index}` }
  }))
}
