import { Component, computed, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormGeneratorStore } from '../form-generator.store';
import { PopoverModule } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridLayout } from '../form-generator';
import { RadioButtonModule } from 'primeng/radiobutton';

type LayoutForm = {
  [P in keyof GridLayout]: FormControl<GridLayout[P] | null>;
};

@Component({
  selector: 'app-form-generator-item',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    PopoverModule,

    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    SelectModule,
    RadioButtonModule
  ],
  templateUrl: './form-generator-item.component.html',
  styleUrl: './form-generator-item.component.scss'
})
export class FormGeneratorItemComponent {
  @Input() rowIndex = 0;
  @Input() colIndex = 0;
  @Input() data: GridLayout | undefined;

  keyOptions = [
    { label: 'text', value: 'text' },
    { label: 'number', value: 'number' },
    { label: 'date', value: 'date' },
    { label: 'reference', value: 'reference' },
  ]

  orientationOptions = [
    { label: 'col', value: 'col' },
    { label: 'row', value: 'row' },
  ]
  generatorStore = inject(FormGeneratorStore);

  fieldOptions = computed(() => this.generatorStore.$formGenerator().fields.map((field) => ({ label: field.name, value: field.name })))

  layoutForm = new FormGroup<Omit<LayoutForm, 'content' | 'colIndex' | 'rowIndex'>>({
    field: new FormControl<string>(''),
    key: new FormControl<'number' | 'text' | 'date' | 'reference' | null>(null),
    isNull: new FormControl<boolean>(false),
    orientation: new FormControl<'row' | 'col'>('col'),
    label: new FormControl<string>(''),
  })

  constructor() {
    this.layoutForm.valueChanges.subscribe((value) => {
      console.log('col-row', this.colIndex, this.rowIndex)
      const grid = this.generatorStore.gridWrapper()[this.colIndex][this.rowIndex];
      let content = grid.content;
      switch (value.key) {
        case 'text':
          content = (
                  `<div class="col-span-12 md:col-span-3">\n` +
            `\t\t\t\t<label for="txt-${value.field}">${value.label}</label>\n` +
            `\t\t\t</div>\n` +

            `\t\t\t<div class="col-span-12 md:col-span-9">\n` +
            `\t\t\t\t<input id="txt-${value.field}"\n` +
            `\t\t\t\ttype="text"\n` +
            `\t\t\t\tpInputText\n` +
            `\t\t\t\tformControlName="${value.field}"\n` +
            `\t\t\t\tclass="w-full"\n` +
            `\t\t\t\tfluid\n` +
            `\t\t\t\t/>\n` +
            `\t\t\t</div>`)
            this.generatorStore.importAction(`import { InputTextModule } from 'primeng/inputtext';`, 'InputTextModule')
          break;

        case 'number':
          content = (
                  `<div class="col-span-12 md:col-span-3">\n` +
            `\t\t\t\t<label for="num-${value.field}">${value.label}</label>\n` +
            `\t\t\t</div>\n` +

            `\t\t\t<div class="col-span-12 md:col-span-9">\n` +
            `\t\t\t\t<p-inputNumber\n` +
            `\t\t\t\t\tinputId="num-${value.field}"\n` +
            `\t\t\t\t\tformControlName="${value.field}"\n` +
            `\t\t\t\t\tclass="w-full"\n` +
            `\t\t\t\t\tmode="decimal"\n` +
            `\t\t\t\t\tlocale="de-DE"\n` +
            `\t\t\t\t\t[min]="0"\n` +
            `\t\t\t\t\tfluid\n` +
            `\t\t\t\t\t/>\n` +
            `\t\t\t</div>`)
            this.generatorStore.importAction(`import { InputNumberModule } from 'primeng/inputnumber';`, 'InputNumberModule')
          break;

        case 'date':
          content = (
            `<div class="col-span-12 md:col-span-3">\n` +
            `\t\t\t\t<label for="date-${value.field}">${value.label}</label>\n` +
            `\t\t\t</div>\n` +

            `\t\t\t<div class="col-span-12 md:col-span-9">\n` +
            `\t\t\t\t<p-datepicker\n` +
            `\t\t\t\t\tinputId="date-${value.field}"\n` +
            `\t\t\t\t\tformControlName="${value.field}"\n` +
            `\t\t\t\t\tfluid\n` +
            `\t\t\t\t\t/>\n` +
            `\t\t\t</div>`)
            this.generatorStore.importAction(`import { DatePickerModule } from 'primeng/datepicker';`, 'DatePickerModule')
          break;

        default:
          break;
      }
      console.log(value);
      this.generatorStore.updateGrid(this.rowIndex, this.colIndex, { ...value, content } as any);


    })
  }

  assign() {
    this.generatorStore.updateGrid(this.rowIndex, this.colIndex, { ...(this.generatorStore.gridWrapper()[this.colIndex][this.colIndex] || {}), isNull: false } as any);
  }
}
