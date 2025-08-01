import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Doc } from '../../models/docs.model';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import hljs from 'highlight.js';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-docs-dialog',
  standalone: true,
  imports: [CommonModule, AccordionModule, ButtonModule],
  template: `
    <div class="flex flex-col gap-4 p-4">
      <div class="template-doc-dialog m-0 flex flex-col">
        <ng-template [ngComponentOutlet]="doc?.component" />
      </div>
      @if (doc && doc.files && doc.files.length > 0) {
        <p-accordion [value]="doc.files.length === 1 ? doc.files[0].name : ''">
              <ng-container *ngFor="let file of doc?.files">
                <p-accordion-panel [value]="file.name">
                  <p-accordion-header>
                      <span class="flex items-center gap-2 w-full px-4">
                        <span class="font-bold whitespace-nowrap">{{ file.name }}</span>
                        <span class="text-sm text-gray-500">{{ file.type }}</span>
                        <button pButton icon="pi pi-clone" class="ml-auto w-10 h-10" (click)="copyToClipboard($event, file.content)"></button>
                      </span>
                  </p-accordion-header>
                  <p-accordion-content>
                      <pre [ngClass]="'language-' + file.type" class="w-full overflow-x-auto m-0 p-4 bg-gray-700 rounded-lg">
                            <code [ngClass]="'language-' + file.type + ' text-white'" [innerHTML]="highlightCode(file.content, file.type)">
                            </code>
                          </pre>
                  </p-accordion-content>
                </p-accordion-panel>
              </ng-container>
          </p-accordion>
      }
    </div>
  `,
  styles: ``
})
export class DocsDialogComponent {
  config = inject(DynamicDialogConfig)
  ref = inject(DynamicDialogRef)
  messageService = inject(MessageService)

  doc: Doc | null = null;

  ngOnInit() {
    if (!this.config.data) {
      return;
    }

    this.doc = this.config.data
  }

  highlightCode(content: string, type: string): string {
    return hljs.highlight(content, { language: type }).value;
  }

  copyToClipboard(event: any, content: string): void {
    event.stopPropagation();

    navigator.clipboard.writeText(content).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copied to Clipboard',
        detail: 'The code has been copied to your clipboard.',
        life: 3000
      });

      console.log('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }


  close() {
    this.ref.close()
  }
}
