import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  /**
   * Formate un prix en FCFA avec séparateurs de milliers
   * @param price Prix à formater
   * @returns Prix formaté avec FCFA
   */
  formatPrice(price: number): string {
    if (price === null || price === undefined) {
      return '0 FCFA';
    }
    
    // Arrondir à l'entier le plus proche (FCFA n'a pas de centimes)
    const roundedPrice = Math.round(price);
    
    // Ajouter des séparateurs de milliers
    const formattedPrice = roundedPrice.toLocaleString('fr-FR');
    
    return `${formattedPrice} FCFA`;
  }

  /**
   * Formate un prix pour l'affichage dans les formulaires
   * @param price Prix à formater
   * @returns Prix sans devise pour les inputs
   */
  formatPriceForInput(price: number): number {
    return Math.round(price);
  }

  /**
   * Parse un prix depuis un string
   * @param priceString String contenant le prix
   * @returns Prix en nombre
   */
  parsePrice(priceString: string): number {
    const cleaned = priceString.replace(/[^\d]/g, '');
    return parseInt(cleaned) || 0;
  }

  /**
   * Calcule le total d'une commande
   * @param unitPrice Prix unitaire
   * @param quantity Quantité
   * @returns Total formaté
   */
  calculateTotal(unitPrice: number, quantity: number): string {
    const total = unitPrice * quantity;
    return this.formatPrice(total);
  }
}
