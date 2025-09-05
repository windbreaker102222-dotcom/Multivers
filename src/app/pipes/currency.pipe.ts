import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

@Pipe({
  name: 'fcfa',
  standalone: true
})
export class FcfaPipe implements PipeTransform {

  constructor(private currencyService: CurrencyService) {}

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '0 FCFA';
    }
    return this.currencyService.formatPrice(value);
  }
}
