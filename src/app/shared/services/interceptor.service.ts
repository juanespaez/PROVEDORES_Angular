import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { UrlSanitizerService } from './url-sanitizer.service';
import { TokenService } from './token.service';
import { catchError, firstValueFrom, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LogoutService } from './logout.service';

//servicio para interceptar las peticiones, validar si cumplen con el sanitizer
//y modificar encabezados de autorización con bearer token.
//Cuando detecta error 401 y valida estado de los tokens en el storage gestiona el refresh token

export const InterceptorService: HttpInterceptorFn = (req, next) => {
  const sanitizer = inject(UrlSanitizerService)
  const tokenService = inject(TokenService)
  const authservice = inject(AuthService)
  const router = inject(Router)
  const logoutService = inject(LogoutService)
  const sanitizedUrl = sanitizer.sanitizeUrl(req.url);
  let modifiedReq = req;
  if (sanitizedUrl !== '' && !isExceptionRoute(req.url)) {
    try {
      const authToken = tokenService.getToken();
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    } catch (error) {
      logoutService.logOut(true)
      return throwError(() => error)
    }
    return next(modifiedReq).pipe(handleHttpError(tokenService, authservice, req, next, router, logoutService));
  }
  return next(modifiedReq);
}

function handleHttpError(tokenService: TokenService, authservice: AuthService, req: HttpRequest<unknown>, next: HttpHandlerFn, router: Router, logoutService: LogoutService) {
  return catchError((err) => {
    if (err.status !== 401) {
      throw err;
    }
    try {
      const hasToken: boolean = tokenService.hasToken();
      const hasValidToken: boolean = tokenService.hasValidToken();
      const hasRefreshToken: boolean = tokenService.hasRefreshToken();
      if (err.status === 401 && hasRefreshToken && hasToken && !hasValidToken) {
        return refreshToken(tokenService, authservice, req, next, router);
      } else {
        logoutService.logOut(true);
        return throwError(() => err);
      }
    } catch (error) {
      //logoutService.logOut(true);
      return throwError(() => err);
    }
  }) as (source: Observable<HttpEvent<unknown>>) => Observable<HttpEvent<unknown>>;
}

function refreshToken(tokenService: TokenService,
  authservice: AuthService,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  router: Router) {
  Swal.fire({
    title: 'Actualizando sesión...',
    text: 'Por favor, espera mientras se refresca la sesión.',
    icon: 'info',
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    },
    timer: 1000
  });
  return from(retrieveToken(tokenService, authservice, router)).pipe(
    switchMap(newAccessToken => {
      let modifiedReqRefresh = req.clone({
        setHeaders: {
          Authorization: `Bearer ${newAccessToken}`
        }
      });
      return next(modifiedReqRefresh);
    }),
    catchError(() => {
      return of();
    })
  )
}

const retrieveToken = async (tokenService: TokenService, authservice: AuthService, router: Router): Promise<string> => {
  const location = router['location']._locationStrategy._platformLocation._location.pathname
  try {
    const refresh = tokenService.getTokenRefresh();
    const token = await firstValueFrom(authservice.getToken(refresh, true).pipe(
      tap((data) => {
        tokenService.setToken(data.access_token);
        tokenService.setTokenRefresh(data.refresh_token);
      }),
      map(data => data.access_token)
    ))
    router.navigate([`${location}`])
    return token;
  } catch (error) {
    router.navigate([`${location}`])
    throw error
  }
}

function isExceptionRoute(req: string) {
  return req.includes('oauth2') || req.includes('authorize') || req.startsWith('assets/');
}
