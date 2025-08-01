import { Component } from '@angular/core';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { SearchFormComponent } from '../components/search-form/search-form.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [TopbarComponent, SearchFormComponent],
  template: `
  <div class="flex flex-col h-full gap-4">
    <div class="sticky top-0 z-50">
      <div class="w-full mb-1">
        <app-topbar></app-topbar>
      </div>
      <!-- <div class="w-full p-2">
        <app-search-form></app-search-form>
      </div> -->
    </div>
    <div class="layout-content px-2">
      <ng-content></ng-content>
    </div>
  </div>
  `,
  styles: `
  layout-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    background-color: var(--surface-0);
    color: var(--text-color);
  }
  `
})
export class LayoutComponent {

}
