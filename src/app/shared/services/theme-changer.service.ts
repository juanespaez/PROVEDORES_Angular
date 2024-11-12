import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeChangerService {
  theme = signal<Theme>(localStorage.getItem('theme') as Theme || 'light');
  private _document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      if (this.theme() === 'dark') {
        this._document.documentElement.classList.add('dark');
      } else {
        this._document.documentElement.classList.remove('dark');
      }
    });
  }

  toggleTheme() {
    this.theme.update((value) => {
      const currentTheme = value === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', currentTheme);
      return currentTheme;
    });
  }
}
