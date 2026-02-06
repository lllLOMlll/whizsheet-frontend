import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'whizsheet-theme';

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return 'dark';
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly theme = signal<Theme>(getInitialTheme());

  constructor() {
    effect(() => {
      const current = this.theme();

      document.documentElement.setAttribute('data-theme', current);

      localStorage.setItem(STORAGE_KEY, current);
    });

    
  }

  toggle() {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
  }

  setDark() {
    this.theme.set('dark');
  }

  setLight() {
    this.theme.set('light');
  }

  current() {
    return this.theme();
  }
}
