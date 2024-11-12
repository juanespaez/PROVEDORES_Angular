import { Injectable, OnDestroy } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha-2';
import { Subject } from 'rxjs';

//servicio para pedir token de recaptcha al suscribirse al método validateRecaptcha()
@Injectable({
  providedIn: 'root'
})
export class RecaptchaService implements OnDestroy {

  private ngUnsubscribe: Subject<void>

  constructor(private recaptchaService: ReCaptchaV3Service) {
    this.ngUnsubscribe = new Subject<void>();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  validateRecaptcha() {
    return this.recaptchaService.execute('importantAction');
  }

  showRecaptchaBadge(): void {
    const element = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement;
    if (element) {
      element.style.visibility = 'visible';
    }
  }

  hideRecaptchaBadge(): void {
    const element = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement;
    if (element) {
      element.style.visibility = 'hidden';
    }
  }
}
