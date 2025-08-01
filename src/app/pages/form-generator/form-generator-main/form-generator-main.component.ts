import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormGeneratorStore } from '../form-generator.store';
import { FormGenerator, FormItem, Grid } from '../form-generator';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';

type GridForm = {
  [P in keyof Grid]: FormControl<Grid[P]>;
};

type Header = Omit<FormGenerator, 'grid' | 'docs' | 'fields'>;
type HeaderForm = {
  [P in keyof Header]: FormControl<Header[P]>;
};

@Component({
  selector: 'app-form-generator-main',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    FormsModule,
    SelectModule,
    CheckboxModule,
    TextareaModule
  ],
  templateUrl: './form-generator-main.component.html',
  styleUrl: './form-generator-main.component.scss'
})
export class FormGeneratorMainComponent {
  generatorStore = inject(FormGeneratorStore);

  typeOptions = [
    { label: 'text', value: 'text' },
    { label: 'number', value: 'number' },
    { label: 'date', value: 'date' },
    { label: 'options', value: 'options' },
    { label: 'buttonAction', value: 'buttonAction' },
    { label: 'radio', value: 'radio' },
  ]

  gridForm = new FormGroup<Omit<GridForm, 'gridLayoutList'>>({
    column: new FormControl<number>({ value: 2, disabled: false }),
    row: new FormControl<number>({ value: 3, disabled: false }),
    styleClass: new FormControl<string>({ value: '', disabled: false }),
  });

  headerForm = new FormGroup<HeaderForm>({
    formName: new FormControl<string>({ value: 'Example', disabled: false })
  })

  jsonDataInput = signal<string>('')

  constructor() {
    // effect(() => {

    // })
  }

  generateGrid() {
    this.generatorStore.setGrid({
      column: this.gridForm.controls.column.value,
      row: this.gridForm.controls.row.value,
      styleClass: this.gridForm.controls.styleClass?.value,
      gridLayoutList: Array.from({ length: (this.gridForm.controls.column.value ?? 0) }, (_, colIndex) => {
        return (
          Array.from({ length: (this.gridForm.controls.row.value ?? 0) }, (_, rowIndex) => {
            return {
              colIndex,
              rowIndex,
              key:  null,
              label: '',
              field: '',
              isNull: true,
              orientation: 'col',
              content: `<!-- test col-${colIndex + 1}/row-${rowIndex + 1} -->`
            }
          })
        )
      })
    });
  }

  generateFormName() {
    if (!this.headerForm.controls.formName.value) {
      alert('Form Name tidak boleh kosong');
      return;
    }

    if (this.headerForm.controls.formName.value !== this.headerForm.controls.formName.value.trim()) {
      alert('Form Name tidak boleh menggunakan spasi');
      return;
    }
    this.generatorStore.setFormName(this.headerForm.controls.formName.value)
  }

  initGenerateDoc() {
    this.generatorStore.updateDoc({
      type: 'html',
      name: 'form-generated.component.html',
      content: this.generatorStore.htmlContent()
    })

    this.generatorStore.updateDoc({
      type: 'ts',
      name: 'form-generated.component.ts',
      content: this.generatorStore.tsContent()
    })

    this.generatorStore.updateDoc({
      type: 'scss',
      name: 'form-generated.component.scss',
      content: ('')
    })
  }

  generate() {
    this.generateFormName();
    this.generatorStore.generateType();
    this.generateGrid()
    setTimeout(() => {
      this.initGenerateDoc()
    }, 800)
  }

  exportJSONtoField(): FormItem[] {
    let fields: FormItem[] = [];

    let obj: any;
    try {
      obj = JSON.parse(this.generatorStore.$jsonDataToField());
      console.log(obj)
    } catch {
      return [];
    }
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return [];
    }
    for (let key of Object.keys(obj)) {
      this.generatorStore.addField();
      const getLastId = Math.max(0, ...fields.map(({ id }: { id: number }) => id));
      const newField = {
        id: getLastId + 1,
        name: `field${getLastId + 1}`,
        type: 'text', // or another default type as per your FormItem definition
        defaultValue: '',
        options: []
        // add other required FormItem properties here if needed
      };
      let type = 'text';
      let defaultValue = '';
      if (typeof obj[key] === 'string' && obj[key] === 'string') {
        type = 'text'
      } else if (typeof obj[key] === 'number') {
        type = 'number'
        defaultValue = '0';
      } else if (typeof obj[key] === 'boolean') {
        type = 'checkbox'
        defaultValue = 'false';
      } else if (
        typeof obj[key] === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(obj[key])
      ) {
        type = 'date'
        defaultValue = 'new Date()';
      }

      fields.push({ ...newField, name: key, type, defaultValue } as FormItem)
      setTimeout(() => {
        this.generatorStore.updateField({ ...newField, name: key, type })
      }, 700)

    }
    return fields;
  }


  update(field: FormItem, key: 'type' | 'name' | 'defaultValue' | 'nullable' | 'options', data: any) {

    console.log('change', data)
    let updated = { ...field };
    switch (key) {
      case 'name':
        updated = { ...field, name: data };
        break;
      case 'type':
        updated = { ...field, type: data };
        switch (data) {
          case 'text':
            updated = { ...field, type: data, defaultValue: '', options: [] }
            break;
          case 'number':
            updated = { ...field, type: data, defaultValue: 0, options: [] }
            break;
          case 'date':
            updated = { ...field, type: data, defaultValue: 'new Date()', options: [] }
            break;
          case 'options':
            updated = { ...field, type: data, defaultValue: null, options: [...(field.options ?? [])] }
            break;
          case 'buttonAction':
            updated = { ...field, type: data, defaultValue: null, options: [] }
            break;
          case 'nullable':
            console.log(data)
            updated = { ...field, type: data, defaultValue: null, options: [...(field.options ?? [])] }
            break;

          default:
            updated = { ...field, type: data, defaultValue: null }
            break;
        }
        break;
      case 'options':
        updated = { ...field, options: data };
        break;
      case 'nullable':
        updated = { ...field, nullable: data };
        break;
      default:
        updated = { ...field };
        break;
    }
    if (JSON.stringify(updated) === JSON.stringify(field)) {
      return;
    }

    this.generatorStore.updateField({ ...field, ...updated });
  }

  jsonInput(data: any) {
    console.log(data);

    this.generatorStore.$jsonDataToField.set(data)

    setTimeout(() => {

    }, 1000)
  }

  addOptions(field: FormItem) {
    this.update(field, 'options', [...(field.options ?? []), { label: 'new label', value: 'new value' }])
  }

  updateOptions(field: FormItem, option: { label: string, value: any }, key: 'label' | 'value', data: any) {
    let updated = { ...option };
    switch (key) {
      case 'label':
        updated = { ...option, label: data };
        break;
      case 'value':
        updated = { ...option, value: data };
        break;
      default:
        updated = { ...option };
        break;
    }
    const index = field.options?.findIndex((data) => data.label === option.label && data.value === option.value) ?? -1;
    if (index === -1) {
      return;
    }
    if (field.options?.length === 0) {
      return;
    }

    const updatedOptions = field.options ?? [];

    updatedOptions[index] = option;

    if (JSON.stringify(updated) === JSON.stringify(option)) {
      return;
    }
    this.update(field, 'options', updatedOptions)
  }

  clearOptions(field: FormItem) {
    this.update(field, 'options', [])
  }



}
