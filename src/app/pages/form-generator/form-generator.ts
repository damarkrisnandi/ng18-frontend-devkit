import { Validators } from "@angular/forms"

export type FormGenerator = {
  formName: string | null,
  fields: FormItem[],
  grid: Grid,
  docs: Doc[]
}

export type Grid = {
  row: number | null,
  column: number | null,
  styleClass?: string | null,
  gridLayoutList: GridLayout[][]
}

export type GridLayout = {
  colIndex: number,
  rowIndex: number,
  key: 'text' | 'number' | 'date' | 'reference' | null,
  label: string,
  field: string,
  isNull: boolean,
  content: string,
  orientation: 'row' | 'col'
}

export type FormItem = {
  id: number,
  name: string,
  type: string, // nanti ambil dari reference enum kali
  // validators?: Validators[],
  defaultValue: any,
  nullable?: boolean,
  options?: { label: string, value: any }[]
  buttonAction?: () => void
}

export type Doc = {
  type: 'html' | 'scss' | 'ts',
  name: string,
  content: string
}
