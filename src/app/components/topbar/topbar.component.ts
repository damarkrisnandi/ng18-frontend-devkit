import { Component, inject } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { DrawerModule } from 'primeng/drawer'
import { DocStore } from '../../store/doc.store';
import { Doc } from '../../models/docs.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { DocsDialogComponent } from '../docs-dialog/docs-dialog.component';
import { routes } from '@app/app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, AvatarModule, ThemeSwitcherComponent, DrawerModule, ReactiveFormsModule],
  template: `
    <p-toolbar [style]="{ 'border-radius': '0', 'padding': '1rem 1rem 1rem 1.5rem' }">
      <ng-template #start>
          <div class="flex items-center gap-4">
            <p-button (click)="visible = true" icon="pi pi-align-left" [text]="true" [raised]="true"  />
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-bold text-blue-400">Devkit</h1>
              <h1 class="text-2xl font-bold">Angular+Primeng+Tailwind</h1>
            </div>
            <div class="hidden md:flex items-center gap-2">
              <!-- <p>Search and explore documentation for PrimeNG and TailwindCSS components quickly and efficiently.</p> -->
            </div>
          </div>
      </ng-template>

      <ng-template #end>
          <div class="flex items-center gap-2">
              <app-theme-switcher />

          </div>
      </ng-template>
  </p-toolbar>

  <p-drawer [(visible)]="visible" header="Find Blocks">
  <div class="flex flex-col gap-4">
      <form [formGroup]="searchForm" class="flex flex-col gap-2 w-full">
        <input
        type="text"
        pInputText
        placeholder="Search"
        formControlName="search"
        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

      </form>
      <div class="flex flex-col gap-2">
        @for (route of menuRoutes; track $index) {
          <p-button [icon]="route.data?.['icon'] ?? ''" styleClass="w-full"  [label]="route.data?.['title'] ?? ''" severity="secondary" (click)="router.navigate([route.path ?? '/'])"></p-button>
        }
      </div>

  </div>

  </p-drawer>

  `,
  styles: ``
})
export class TopbarComponent {
  menuRoutes = routes;
  searchForm = new FormGroup({
    search: new FormControl('', { nonNullable: true })
  });
  docStore = inject(DocStore);
  dialogService = inject(DialogService)
  visible: boolean = false;
  router = inject(Router);

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

  viewDoc(doc: Doc) {
    const ref = this.dialogService.open(
      DocsDialogComponent,
      {
        header: doc.header,
        modal: true,
        styleClass: 'w-7/12',
        closable: true,
        data: doc
      }
    )

    ref.onClose.subscribe(() => {

    })
  }

}
