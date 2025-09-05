import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  constructor() { }

  /**
   * Génère un lien WhatsApp avec un message pré-rempli
   */
  generateWhatsAppLink(productName: string, productPrice: number, customMessage?: string): string {
    const adminPhone = environment.whatsapp.adminPhone;
    
    const defaultMessage = `Bonjour, je suis intéressé(e) par le produit "${productName}" au prix de ${productPrice}FCFA. Pourriez-vous me donner plus d'informations ?`;
    
    const message = customMessage || defaultMessage;
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${adminPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
  }

  /**
   * Génère un lien WhatsApp pour une commande avec détails client
   */
  generateOrderWhatsAppLink(
    productName: string, 
    productPrice: number, 
    clientName: string, 
    clientPhone: string, 
    clientMessage: string
  ): string {
    const adminPhone = environment.whatsapp.adminPhone;
    
    const message = `Nouvelle commande via Multivers:
    
Produit: ${productName}
Prix: ${productPrice}FCFA
Client: ${clientName}
Téléphone: ${clientPhone}
Message: ${clientMessage}`;
    
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${adminPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
  }

  /**
   * Ouvre WhatsApp dans un nouvel onglet
   */
  openWhatsApp(link: string): void {
    window.open(link, '_blank');
  }

  /**
   * Redirige vers WhatsApp dans la même fenêtre
   */
  redirectToWhatsApp(link: string): void {
    window.location.href = link;
  }
}
