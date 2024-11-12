import { Location } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { GlobalConstants } from '@shared/models/global-constants';
import { AuthService } from '@shared/services/auth.service';
import { EventBusService } from '@shared/services/event-bus.service';
import { LogoutService } from '@shared/services/logout.service';
import { SpinnerResponsiveService } from '@shared/services/spinner-responsive.service';
import { Theme, ThemeChangerService } from '@shared/services/theme-changer.service';
import { TokenService } from '@shared/services/token.service';
import { getOauth2Url } from '@shared/utils/reusableFunctions';
import { Subject, catchError, takeUntil, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { SupplierManagerComponent } from './modules/dashboard/components/supplier-manager/supplier-manager.component';
import { SupplierEvaluationComponent } from './modules/dashboard/components/supplier-evaluation/supplier-evaluation.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    MatProgressSpinnerModule,
    SupplierManagerComponent,
  SupplierEvaluationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy, FormsModule {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  title = GlobalConstants.nombreProyecto;
  showSpinner: boolean;
  siteName!: string
  baseUrl!: string
  isLogged: boolean
  theme: WritableSignal<Theme>
  spinnerDiameter: number;

  constructor(private eventBusService: EventBusService,
    private tokenService: TokenService,
    private authService: AuthService,
    private location: Location,
    private router: Router,
    private titleService: Title,
    private logoutService: LogoutService,
    private themeService: ThemeChangerService,
    private spinnerService: SpinnerResponsiveService) {
    this.showSpinner = false;
    this.isLogged = false;
    this.theme = this.themeService.theme
    this.spinnerDiameter = 0;
  }
  ngAfterViewInit(): void {
    this.updateSpinnerSize();
    this.spinnerService.isSmallScreenDeviceChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.updateSpinnerSize();
    });
  }

  updateSpinnerSize() {
    this.spinnerDiameter = this.spinnerService.isSmallScreenDevice ? 50 : 100;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.titleService.setTitle(`${this.title}`);
    this.eventBusService.getSpinnerState().pipe(takeUntil(this.ngUnsubscribe)).subscribe(state => {
      this.showSpinner = state;
    });
    //Funcion necesaria para verificar la validez del token una vez hecho el login 
    this.verifyToken();
  }

  handleLoginOrLogoutEvent(isLogin: boolean) {
    if (isLogin) {
      this.login()
    } else {
      this.logout()
    }
  }

  login() {
    const codeUrl: string = getOauth2Url();
    this.router.navigate(['waitAuth'], { queryParams: { url: codeUrl } });
  }

  logout() {
    this.logoutService.logOut()
  }

  verifyToken() {
    try {
      if (this.tokenService.hasToken() && this.tokenService.hasRefreshToken()) {
        if (this.tokenService.hasValidToken()) {
          this.handleValidToken();
        } else {
          this.handleInvalidToken();
        }
      } else {
        this.handleNoToken();
      }
    } catch (error) {
      this.logoutService.logOut(true)
    }
  }

  private handleValidToken() {
    this.isLogged = true;
    this.tokenService.updateLoggedInStatus(true);
  }

  private handleInvalidToken() {
    const refresh = this.tokenService.getTokenRefresh();
    this.authService.getToken(refresh, true).pipe(
      takeUntil(this.ngUnsubscribe),
      tap((data) => {
        this.tokenService.setToken(data.access_token);
        this.tokenService.setTokenRefresh(data.refresh_token);
        this.handleValidToken();
        this.router.navigate([`${this.location.path()}`])
      }),
      catchError((err) => {
        this.logoutService.logOut(true)
        throw err
      })
    ).subscribe();
  }

  private handleNoToken() {
    this.isLogged = false;
    this.tokenService.updateLoggedInStatus(false);
  }

  //
  
}
