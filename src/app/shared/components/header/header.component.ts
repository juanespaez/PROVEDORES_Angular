import { Component, EventEmitter, OnDestroy, OnInit, Output, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { TokenService } from '@shared/services/token.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GlobalConstants } from '@shared/models/global-constants';
import { Theme, ThemeChangerService } from '@shared/services/theme-changer.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() loginOrLogoutEvent
  siteName: string
  baseUrl: string
  ngUnsubscribe: Subject<void>
  isLogged: boolean;
  theme: WritableSignal<Theme>

  constructor(
    private tokenService: TokenService, private themeManager: ThemeChangerService) {
    this.ngUnsubscribe = new Subject<void>();
    this.loginOrLogoutEvent = new EventEmitter<boolean>();
    this.isLogged = false
    this.siteName = 'Inicio'
    this.baseUrl = '/'
    this.theme = this.themeManager.theme
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  //verifica si el usuario está logueado para renderizar el botón de login o logout
  private checkLogin() {
    this.tokenService.isLoggedIn.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isLoggedIn => {
      this.isLogged = isLoggedIn;
      if (this.isLogged) {
        this.siteName = GlobalConstants.nombreSeccion
      }
    });
  }

  //funcion para transmitir evento de logout al app component
  logOut(): void {
    this.loginOrLogoutEvent.emit(false)
  }

  //funcion para transmitir evento de login al app component
  Onlogin() {
    this.loginOrLogoutEvent.emit(true)
  }

  toggleTheme() {
    this.themeManager.toggleTheme();
  }
}
