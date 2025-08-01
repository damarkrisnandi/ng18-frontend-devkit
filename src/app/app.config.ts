import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import  Aura from '@primeng/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
              darkModeSelector: '.p-dark',
              lightModeSelector: '.p-light',
              // cssLayer: {
              //   name: 'primeng',
              //   // Enable PrimeNG CSS layer and configure the tailwind styles to have higher specificity with layering
              //   order: 'tailwind-base, primeng, tailwind-utilities',
              // },
            }
        }
    }),
    // provideHttpClient(
    //   withInterceptors(
    //     [httpClientInterceptor, sessionInterceptor, errorInterceptor]
    //   )
    // ),
    ConfirmationService,
    DialogService,
    MessageService
  ]
};
