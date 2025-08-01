import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DocStore } from '../../store/doc.store';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule],
  template: `
    <form [formGroup]="searchForm" class="flex flex-col gap-2 w-full">
      <input
      type="text"
      pInputText
      placeholder="Search Block"
      formControlName="search"
      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

    </form>
  `,
  styles: ``
})
export class SearchFormComponent {
  docStore = inject(DocStore)
  searchForm = new FormGroup({
    search: new FormControl('', { nonNullable: true })
  });

  constructor() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300), // Uncomment if you want to debounce the Input
        distinctUntilChanged() // Uncomment if you want to only emit when the value changes
      )
      .subscribe(value => {
        if (value.search === undefined || value.search === null) {
          value.search = '';
          return;
        }

        this.docStore.setSearchTerm(value.search);
      })
  }
}
