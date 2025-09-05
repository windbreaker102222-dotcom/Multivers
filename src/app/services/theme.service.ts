import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<'light' | 'dark'>('light');
  public theme$ = this.currentTheme.asObservable();

  constructor() {
    // Charger le thème sauvegardé ou détecter la préférence système
    this.loadTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('multivers-theme') as 'light' | 'dark';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(theme);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme.next(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('multivers-theme', theme);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.currentTheme.value;
  }
}
