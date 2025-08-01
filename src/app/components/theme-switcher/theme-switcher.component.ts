import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [],
  template: `
  <button
    (click)="toggleDarkMode($event)"
    [class.text-primary]="theme === 'dark'"
    [class.text-primary-700]="theme === 'light'"
    class="inline-block w-full rounded-xl p-4 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white bg-white/50 dark:bg-gray-800/50 dark:hover:bg-gray-700">
    <i [class]="theme === 'dark' ? 'pi pi-moon' : 'pi pi-sun'"></i>

  </button>
  `,
  styles: ['']
})
export class ThemeSwitcherComponent {
  @Input() selector: string | null = null;
  theme: 'light' | 'dark' = "light";

  themes: ('light' | 'dark')[] = [ 'light', 'dark'];
  ngOnInit() {
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.theme = preferredTheme;

    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme !== null) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme(this.theme);
    }
  }

  setTheme(theme: 'dark' | 'light') {
    this.theme = theme;

    const element = document.querySelector(this.selector || 'html');
    if (!element) {
      console.warn('HTML element not found');
      return;
    }

    if (!this.selector) {
      localStorage.setItem('theme', theme);
    }
    if (theme === 'dark') {
      element?.classList.add('p-dark');
      element?.classList.add('dark');
      element?.classList.remove('p-light');
      element?.classList.remove('light');
    } else {
      element?.classList.remove('p-dark');
      element?.classList.remove('dark');
      element?.classList.add('p-light');
      element?.classList.add('light');
    }
  }

  getTheme(): string {
    return this.theme;
  }

  toggleDarkMode(event: any) {
    event.stopPropagation();
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

}
