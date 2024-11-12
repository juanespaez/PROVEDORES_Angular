import { Injectable } from '@angular/core';
import { GlobalConstants } from '@shared/models/global-constants';

//servicio que se llama desde el interceptor para validar si cada req cumple
//con el pattern de url declarado en las Global Constants y además que no permite <scripts>
//permite archivos assets/ utilizados para la traducción
@Injectable({
  providedIn: 'root'
})
export class UrlSanitizerService {

  private safeUrlPattern: RegExp = GlobalConstants.safeUrlPattern

  sanitizeUrl(url: string): string {
    if (url.startsWith('assets/')) {
      return url;
    }
    if (this.isValidUrl(url) && !this.containsDangerousContent(url)) {
      return url;
    }
    return '';
  }

  private isValidUrl(url: string): boolean {
    return this.safeUrlPattern.test(url);
  }

  private containsDangerousContent(url: string): boolean {
    const dangerousPatterns = [/javascript:/i, /<script>/i, /<\/script>/i];
    return dangerousPatterns.some(pattern => pattern.test(url));
  }
}
