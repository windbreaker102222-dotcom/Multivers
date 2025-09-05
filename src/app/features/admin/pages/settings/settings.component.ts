import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../../services/supabase.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <header class="settings-header">
        <h1>Paramètres</h1>
        <p>Configuration de votre boutique</p>
      </header>

      <div class="settings-card">
        <h2>Image d'arrière-plan de la page d'accueil</h2>
        <div class="form-group">
          <label for="backgroundImage" class="form-label">URL de l'image</label>
          <input 
            type="text" 
            id="backgroundImage" 
            class="form-input" 
            [(ngModel)]="backgroundImageUrl" 
            placeholder="https://example.com/image.jpg">
        </div>
        
        <div class="form-group">
          <label class="form-label">Uploader une image</label>
          <input 
            type="file" 
            class="form-input" 
            (change)="onImageUpload($event)"
            accept="image/*">
          <button class="btn btn-primary" (click)="uploadImage()" [disabled]="!selectedFile">Uploader</button>
        </div>
        
        <div class="preview-section" *ngIf="backgroundImageUrl">
          <h3>Aperçu</h3>
          <div class="image-preview" [style.background-image]="'url(' + backgroundImageUrl + ')'">
            <div class="preview-overlay">
              <h1 class="brand-title">MULTIVERS</h1>
              <p class="brand-subtitle">E-Commerce Premium</p>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button class="btn btn-primary" (click)="saveSettings()">Enregistrer</button>
          <button class="btn btn-outline" (click)="resetToDefault()">Réinitialiser</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-xl);
    }

    .settings-header {
      text-align: center;
      margin-bottom: var(--spacing-xxl);
    }

    .settings-header h1 {
      font-size: 2.5rem;
      color: var(--color-text);
      margin-bottom: var(--spacing-sm);
    }

    .settings-card {
      background: var(--color-background);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      padding: var(--spacing-xl);
      margin-bottom: var(--spacing-xl);
    }

    .settings-card h2 {
      color: var(--color-text);
      margin-bottom: var(--spacing-lg);
    }

    .preview-section {
      margin: var(--spacing-xl) 0;
    }

    .preview-section h3 {
      color: var(--color-text);
      margin-bottom: var(--spacing-md);
    }

    .image-preview {
      height: 300px;
      background-size: cover;
      background-position: center;
      border-radius: var(--radius-md);
      position: relative;
      overflow: hidden;
    }

    .preview-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.3);
    }

    .preview-overlay .brand-title {
      font-size: 3rem;
      font-weight: 800;
      color: white;
      margin-bottom: var(--spacing-sm);
    }

    .preview-overlay .brand-subtitle {
      font-size: 1.25rem;
      font-weight: 300;
      color: white;
      margin: 0;
    }

    .actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
    }
  `]
})
export class SettingsComponent implements OnInit {
  backgroundImageUrl: string = '';
  selectedFile: File | null = null;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const { data, error } = await this.supabaseService.getAppSetting('home_background_image');
      if (error) {
        console.error('Error loading settings:', error);
        return;
      }
      this.backgroundImageUrl = data || '';
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async uploadImage() {
    if (!this.selectedFile) return;

    try {
      // Upload image to Supabase storage
      const fileName = `home-background-${Date.now()}.${this.selectedFile.name.split('.').pop()}`;
      const { data, error } = await this.supabaseService.uploadImage(this.selectedFile, fileName);
      
      if (error) {
        console.error('Error uploading image:', error);
        alert('Erreur lors de l\'upload de l\'image');
        return;
      }
      
      // Update the background image URL in settings
      this.backgroundImageUrl = data.publicUrl;
      await this.saveSettings();
      
      alert('Image uploadée avec succès!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erreur lors de l\'upload de l\'image');
    }
  }

  async saveSettings() {
    try {
      const { data, error } = await this.supabaseService.setAppSetting('home_background_image', this.backgroundImageUrl);
      if (error) {
        console.error('Error saving settings:', error);
        alert('Erreur lors de l\'enregistrement des paramètres');
        return;
      }
      alert('Paramètres enregistrés avec succès!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erreur lors de l\'enregistrement des paramètres');
    }
  }

  resetToDefault() {
    this.backgroundImageUrl = '';
    this.saveSettings();
  }
}
