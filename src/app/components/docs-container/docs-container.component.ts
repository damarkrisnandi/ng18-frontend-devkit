import { Component, inject, Input } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import hljs from 'highlight.js';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { Doc, DocFile } from '../../models/docs.model';
import { DialogService } from 'primeng/dynamicdialog';
import { DocsDialogComponent } from '../docs-dialog/docs-dialog.component';


@Component({
  selector: 'app-docs-container',
  standalone: true,
  imports: [CommonModule, PanelModule, CardModule, ButtonModule, AccordionModule],
  template: `
   <p-panel styleClass="min-h-[300px]">
    <ng-template pTemplate="header">
      <h2 class="text-xl font-semibold">{{ header }}</h2>
    </ng-template>
    <ng-template pTemplate="content" class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md">
      <div class="flex flex-col gap-2 w-full">
        <button pButton icon="pi pi-code" (click)="viewDoc($event, {header, component, files})"></button>
        <div class="template-doc m-0 flex flex-col">
          <ng-template [ngComponentOutlet]="component" />
        </div>
      </div>
    </ng-template>

  </p-panel>
  `,
  styles: `

  `
})
export class DocsContainerComponent {

  @Input() header: string = 'Header';
  @Input() component: any;

  @Input() files: DocFile[] = [];

  messageService = inject(MessageService);
  dialogService = inject(DialogService)

  highlightCode(content: string, type: string): string {
    return hljs.highlight(content, { language: type }).value;
  }

  viewDoc(event: any, doc: Doc) {
      event.stopPropagation();
      const ref = this.dialogService.open(
        DocsDialogComponent,
        {
          header: doc.header,
          modal: true,
          styleClass: 'w-full h-full md:w-3/4 md:h-3/4',
          closable: true,
          data: doc
        }
      )

      ref.onClose.subscribe(() => {

      })
    }
}
