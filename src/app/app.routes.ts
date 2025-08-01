import { Data, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@app/pages/home/home.component').then(c => c.HomeComponent),
    data: { title: 'Home', icon: 'pi pi-home' } as Data
  },
  {
    path: 'form-generator',
    loadComponent: () => import('@app/pages/form-generator/form-generator.component').then(c => c.FormGeneratorComponent),
    data: { title: 'Form Generator', icon: 'pi pi-cog' } as Data
  }
];
