import { computed, effect, Injectable, signal } from "@angular/core";
import { Doc, FormGenerator, FormItem, Grid, GridLayout } from "./form-generator";
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, tap } from "rxjs";

@Injectable()
export class FormGeneratorStore {
  private readonly state = {
    $formGenerator: signal<FormGenerator>({
      formName: 'FormGenerated',
      docs: [],
      fields: [],
      grid: {
        column: 0,
        row: 0,
        gridLayoutList: []
      }
    })
  }

  public readonly $jsonDataToField = signal<string>('');
  public readonly $formGenerator = this.state.$formGenerator.asReadonly();


  private readonly tsState = {
    $importStatement: signal<string[]>([
      `import { Component, inject } from '@angular/core';`,
      `import { FormGroup, FormControl, } from '@angular/forms';`
    ]),
    $typeStatement: signal<string>(''),
    $variableStatement: signal<string>(''),
    $stateManagementSignals: signal<string[]>([
      `$dataSave: signal<${this.state.$formGenerator().formName} | null>(null)`
    ]),
    $computeds: signal<string>(''),

    $angularImportsItem: signal<string[]>([]),
    $angularProvidersItem: signal<string[]>([]),

    $methodStatement: signal<string>(''),

  }

  private readonly htmlState = {
    grid: signal<string[][]>(
      Array.from({ length: (this.$formGenerator().grid.column ?? 0) }, (_, indexCol) => {
        return (
          Array.from({ length: (this.$formGenerator().grid.row ?? 0) }, (_, indexRow) => {
            return (`<!-- test col-${indexCol + 1}/row-${indexRow + 1} -->`)
          })
        )
      })
    )
  }


  colStyleClass = computed(() => {
    switch (this.$formGenerator().grid.column) {
      case 1:
        return 'col-span-12 md:col-span-12 grid gap-2'
      case 2:
        return 'col-span-12 md:col-span-6 grid gap-2'
      case 3:
        return 'col-span-12 md:col-span-4 grid gap-2'
      case 4:
        return 'col-span-12 md:col-span-3 grid gap-2'
      case 6:
        return 'col-span-12 md:col-span-3 grid gap-2'

      default:
        return 'col-span-12 md:col-span-12 grid gap-2'
    }
  })

  public readonly gridWrapper = computed(() =>{
    console.log('cek perubahan', this.$formGenerator().grid.gridLayoutList)
    return this.$formGenerator().grid.gridLayoutList
  })

  public readonly htmlContent = computed(() => {
    return (
      `
<div class=\"grid grid-cols-12 md:gap-2\" [formGroup]="generatedForm">
${Array.from({ length: (this.$formGenerator().grid.column ?? 0) }, (_, indexCol: number) => {
      return (
        `\t<div class=\"${this.colStyleClass()}\">

    ${Array.from({ length: (this.$formGenerator().grid.row ?? 0) }, (_, indexRow: number) => {
          return (`\t<div class=\"grid grid-cols-12 items-center gap-2\">\n\t\t\t${this.gridWrapper()[indexCol][indexRow].content}\n\t\t</div>\n`)
        }).join('\t')
        }
\t</div>
`
      )
    }).join('')}
</div>
`)
  })
  public readonly tsContent = computed(() => (
    `
${this.tsState.$importStatement().join('\n')}
// import-statement

${this.tsState.$typeStatement()}
// type-statement

@Component({
  selector: 'app-${this.kebabize(this.$formGenerator().formName ?? '')}',
  standalone: true,
  imports: [
    ${this.tsState.$angularImportsItem().join('\n\t')}
  ],
  templateUrl: './form-generated.component.html',
  styleUrl: './form-generated.component.scss',
  providers: [
    // providers-statement
    ${this.tsState.$angularProvidersItem()}
  ],
})
export class ${this.$formGenerator().formName}Component {
  // variable-statement
  private readonly state = {
  \t${this.tsState.$stateManagementSignals().join(',\n\t')}
  }
  ${this.tsState.$stateManagementSignals()
    .map((signalData) => `public readonly ${signalData.split(':')[0]} = this.state.${signalData.split(':')[0]}.asReadonly()`)
    .join(',\n')}

  // formgroup-statement
  generatedForm = new FormGroup({
    ${this.$formGenerator().fields.map((field) => {
      const typegenerator = (value: any, type: string, nullable: boolean) => {
        switch (type) {
          case 'text':
            return { type: 'string' + (nullable ? ' | null' : ''), value: `'${value}'` }
            break;
          case 'options':
            return { type: 'string' + (nullable ? ' | null' : ''), value: `'${value}'` }
            break;
          case 'number':
            return { type: 'number' + (nullable ? ' | null' : ''), value: '0' }
            break;
          case 'date':
            return { type: 'Date' + (nullable ? ' | null' : ''), value: 'new Date()' }
            break;

          default:
            return value
            break;
        }
      }

      const valtype = typegenerator(field.defaultValue, field.type, field.nullable ?? false)
      return (
        `${field.name}: new FormControl<${valtype.type}>({ value: ${valtype.value}, disabled: false }), //field_id=${field.id}\n\t`
      )
    }).join('')}
  });
  constructor() {
    this.formGenerated.valueChanges.subscribe((value) => {
    \t\tconst formData = this.generatedForm.getRawValue();
    \t\tthis.state.$dataSave.set(formData)
    })

  }
  // method-statement
}
  `
  ))

  constructor() {
    effect(() => {
      console.log('generator changes', this.$formGenerator())
    })
    // this.exportJsonToField()
  }

  kebabize = (str: string) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())

  setFormName(name: string) {
    this.state.$formGenerator.update((currentState: FormGenerator) => {
      return {
        ...currentState,
        formName: name
      }

    })
  }
  setGrid(grid: Grid) {
    this.state.$formGenerator.update((currentState: FormGenerator) => {
      return {
        ...currentState,
        grid
      }

    })
  }

  updateDoc(doc: Doc) {
    const index = this.$formGenerator().docs.findIndex(({ name }: Doc) => name === doc.name)
    const updatedDocs = this.$formGenerator().docs;

    // check isExist (?)
    if (index === -1) updatedDocs.push(doc);
    else updatedDocs[index] = doc;

    this.state.$formGenerator.update((currentState: FormGenerator) => {
      return {
        ...currentState,
        docs: updatedDocs
      }

    })
  }

  reset() {
    this.state.$formGenerator.set({
      formName: 'FormGenerated',
      docs: [],
      fields: [],
      grid: {
        column: 0,
        row: 0,
        gridLayoutList: []
      }
    })
  }
  addField() {
    const getLastId = Math.max(0, ...this.$formGenerator().fields.map(({ id }: { id: number }) => id));
    const newField = {
      id: getLastId + 1,
      name: `field${getLastId + 1}`,
      type: 'text', // or another default type as per your FormItem definition
      defaultValue: '',
      options: []
      // add other required FormItem properties here if needed
    };

    this.state.$formGenerator.update((currentState: FormGenerator) => {
      return {
        ...currentState,
        fields: [
          ...currentState.fields,
          newField
        ]
      }
    })
  }

  removeField(id: number) {

    this.state.$formGenerator.update((currentState: FormGenerator) => {
      let updatedFields = currentState.fields;
      const deletedIndex = updatedFields.findIndex((data) => data.id === id)
      updatedFields.splice(deletedIndex, 1)
      return {
        ...currentState,
        fields: updatedFields
      }
    })
  }

  clearFields() {
    this.state.$formGenerator.update((currentState: FormGenerator) => {
      return {
        ...currentState,
        fields: []
      }
    })
  }

  updateField(field: FormItem) {

    this.$jsonDataToField()
    const index = this.state.$formGenerator().fields.findIndex(({ id }: { id: number }) => id === field.id)
    const fields = this.state.$formGenerator().fields;
    fields[index] = field;
    this.state.$formGenerator.update((currentState: FormGenerator) => {
      return {
        ...currentState,
        fields
      }
    })

  }

  generateType() {
    let props = [];
    let obj: any;
    try {
      obj = JSON.parse(this.$jsonDataToField());
    } catch (err: any) {
      throw new Error(err.message)
    }
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return
    }
    for (let key of Object.keys(obj)) {
      let type = 'string'
      if (typeof obj[key] === 'string' && obj[key] === 'string') {
        type = 'string'
      } else if (typeof obj[key] === 'number') {
        type = 'number'
      } else if (typeof obj[key] === 'boolean') {
        type = 'boolean'
      } else if (
        typeof obj[key] === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(obj[key])
      ) {
        type = 'Date'
      }
      props.push(`\t${key}: ${type}\n`)
    }
    this.tsState.$typeStatement.update((currentStatement) =>
      `type ${this.state.$formGenerator().formName} = \{\n${props.join('')}\}\n\n` +
      `type ${this.state.$formGenerator().formName}Form = \{\n\t[P in keyof ${this.state.$formGenerator().formName}]: FormControl<${this.state.$formGenerator().formName}[P]>;\n\}`
    )
  }

  updateGrid(row: number, col: number, value: GridLayout) {
    this.state.$formGenerator.update((currentState) => {
      const updatedGridLayoutList = currentState.grid.gridLayoutList;

      updatedGridLayoutList[col][row] = { ...value, rowIndex: row, colIndex: col };
      updatedGridLayoutList[col][row].isNull = false;
      return {
        ...currentState,
        grid: {
          ...currentState.grid,
          gridLayoutList: updatedGridLayoutList
        }
      }
    })

    this.state.$formGenerator.update((currentState) => {
      const formName = this.$formGenerator().formName ?? 'FormGenerated';
      const updatedDocs = this.$formGenerator().docs;
      const docIndex = updatedDocs.findIndex((doc) => doc.name === `${this.kebabize(formName)}.component.html`)

      if (docIndex === -1) {
        return currentState
      }

      updatedDocs[docIndex].content = this.htmlContent()

      return {
        ...currentState,
        docs: updatedDocs
      }
    })
  }

  assignGrid(row: number, col: number) {
    this.state.$formGenerator.update((currentState) => {
      const updatedGridLayoutList = this.$formGenerator().grid.gridLayoutList;

      updatedGridLayoutList[col][row].isNull = false;
      return {
        ...currentState,
        grid: {
          ...currentState.grid,
          gridLayoutList: updatedGridLayoutList
        }
      }
    })


  }

  importAction(moduleImport: string, angularImport: string) {

    this.tsState.$angularImportsItem.update((currentState) => {
      let updatedState = currentState;
      if (currentState.includes(angularImport)) {
        const index =  currentState.findIndex((data) => data === angularImport)
        updatedState[index] = angularImport
      } else {
        updatedState.push(angularImport)
      }
      return updatedState
    })

    this.tsState.$importStatement.update((currentState) => {
      let updatedState = currentState;
      if (currentState.includes(moduleImport)) {
        const index =  currentState.findIndex((data) => data === moduleImport)
        updatedState[index] = moduleImport
      } else {
        updatedState.push(moduleImport)
      }
      return updatedState
    })
  }

}
