import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCompressionService {

  constructor() { }

  /**
   * Compresse une image en réduisant sa taille et sa qualité
   * @param file - Fichier image à compresser
   * @param maxWidth - Largeur maximale (défaut: 800px)
   * @param maxHeight - Hauteur maximale (défaut: 600px)
   * @param quality - Qualité de compression (0.1 à 1.0, défaut: 0.8)
   * @returns Promise<File> - Fichier compressé
   */
  async compressImage(
    file: File, 
    maxWidth: number = 800, 
    maxHeight: number = 600, 
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions en gardant le ratio
        const { width, height } = this.calculateDimensions(
          img.width, 
          img.height, 
          maxWidth, 
          maxHeight
        );

        // Configurer le canvas
        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en blob avec compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Créer un nouveau fichier avec le blob compressé
              const compressedFile = new File(
                [blob], 
                file.name, 
                {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                }
              );
              resolve(compressedFile);
            } else {
              reject(new Error('Erreur lors de la compression'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Erreur lors du chargement de l\'image'));
      };

      // Charger l'image
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Calcule les nouvelles dimensions en gardant le ratio d'aspect
   */
  private calculateDimensions(
    originalWidth: number, 
    originalHeight: number, 
    maxWidth: number, 
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Si l'image est plus grande que les limites, la redimensionner
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  /**
   * Formate la taille du fichier en format lisible
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Vérifie si le fichier est une image
   */
  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Vérifie si la compression est nécessaire
   */
  needsCompression(file: File, maxSizeKB: number = 500): boolean {
    return file.size > maxSizeKB * 1024;
  }
}
