import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { SpinnerResponsiveService } from '@shared/services/spinner-responsive.service';
import { TokenService } from '@shared/services/token.service';
import { Subject, catchError, takeUntil, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';

//componente para recibir el code del oauth2 apuntando a route /authorize

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss'
})
export default class RedirectComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  code: string;
  spinner_mssg: string
  logout_url: string
  spinnerDiameter: number;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected authService: AuthService,
    protected tokenService: TokenService,
    protected route: Router,
    protected ngZone: NgZone,
    private spinnerService: SpinnerResponsiveService) {
    this.code = ''
    this.spinner_mssg = ''
    this.logout_url = ''
    this.spinnerDiameter = 0;
  }

  updateSpinnerSize() {
    this.spinnerDiameter = this.spinnerService.isSmallScreenDevice ? 50 : 100;
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.updateSpinnerSize();
    this.spinnerService.isSmallScreenDeviceChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.updateSpinnerSize();
    });
    if (this.route.url.includes('redirect')) {
      this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
        if (data && 'url' in data) {
          this.logout_url = data['url']
          this.ngZone.run(() => {
            window.location.href = this.logout_url;
          })
        }
      })
    } else {
      this.spinner_mssg = 'Validando información...'
      this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
        if (data && 'code' in data) {
          this.code = data['code']
          this.getAuthTokenWithCode(this.code)
        } else {
          this.tokenService.updateLoggedInStatus(false);
          this.route.navigate([`/`])
        }
      })
    }
  }

  getAuthTokenWithCode(code: string) {
    this.authService.getToken(code).pipe(
      takeUntil(this.ngUnsubscribe),
      tap((data) => {
        this.tokenService.updateLoggedInStatus(true);
        this.tokenService.setToken(data.access_token)
        this.tokenService.setTokenRefresh(data.refresh_token)
        this.route.navigate([`/`])
      }),
      catchError((err) => {
        this.route.navigate([`/`])
        Swal.fire({
          icon: 'error',
          text: 'La autenticación no fue posible. Intenta nuevamente',
        });
        return throwError(() => err);
      })
    ).subscribe()
  }
}
