import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme: Theme = 'light';

  constructor() {
    const saved = localStorage.getItem('theme') as Theme | null;
    this.theme = saved ?? 'light';
    this.apply(this.theme);
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.apply(this.theme);
  }

  set(theme: Theme) {
    this.theme = theme;
    localStorage.setItem('theme', this.theme);
    this.apply(this.theme);
  }

  private apply(theme: Theme) {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }
}
