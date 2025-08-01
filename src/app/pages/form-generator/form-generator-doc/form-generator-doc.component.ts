import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import hljs from 'highlight.js';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { FormGeneratorStore } from '../form-generator.store';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-form-generator-doc',
  standalone: true,
  imports: [CommonModule, PanelModule, CardModule, ButtonModule],
  templateUrl: './form-generator-doc.component.html',
  styleUrl: './form-generator-doc.component.scss'
})
export class FormGeneratorDocComponent {
  messageService = inject(MessageService)
  generatorStore = inject(FormGeneratorStore);

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
}
