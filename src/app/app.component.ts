import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DocsContainerComponent } from './components/docs-container/docs-container.component';
// import { LoginComponent } from './refs/components/login/login.component';
import hljs from 'highlight.js/lib/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { DocStore } from './store/doc.store';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, DocsContainerComponent, ToastModule, ConfirmDialogModule, IconFieldModule, CardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ng18-frontend-devkit';

  docStore = inject(DocStore)

  searchForm = new FormGroup({
    search: new FormControl('', { nonNullable: true })
  });

  constructor() {
    hljs.highlightAll();
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

  getTitle() {
    switch (window.location.pathname) {
      case '/':
        return 'Welcome!'
      case '/form-generator':
        return 'Form Generator'

      default:
        return 'Untitled'
    }
  }
}
