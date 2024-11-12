import { Injectable, NgZone } from '@angular/core';
import { TokenService } from './token.service';
import { SessionStorageService } from './session-storage.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { getOauth2Url } from '@shared/utils/reusableFunctions';

const LOGOUT_URL = environment.logout_url

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private tokenService: TokenService,
    private sessionStorageService: SessionStorageService,
    private ngZone: NgZone, private router: Router) { }

  public logOut(comesFromError?: boolean): void {
    const error: boolean = comesFromError || false
    this.tokenService.updateLoggedInStatus(false);
    this.sessionStorageService.clear();
    if (error) {
      this.ngZone.run(() => {
        this.router.navigate(['redirect'], { queryParams: { url: LOGOUT_URL ?? '' } });
      })
    }
    this.ngZone.run(() => {
      const popup = window.open(LOGOUT_URL, 'logout', 'width=600,height=400');
      if (popup) {
        popup.focus();
        const interval = setInterval(() => {
          if (popup.closed) {
            clearInterval(interval);
          } else {
            popup.close();
            clearInterval(interval);
          }
        }, 500);
      }
    });
    const codeUrl = getOauth2Url();
    setTimeout(() => {
      this.router.navigate(['waitAuth'], { queryParams: { url: codeUrl } });
    }, 500);
  }
}
