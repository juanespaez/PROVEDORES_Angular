import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TokenService } from '@shared/services/token.service';
import { catchError, map, of } from 'rxjs';
import { EventBusService } from '@shared/services/event-bus.service';
import { getOauth2Url } from '@shared/utils/reusableFunctions';

//guard para la autenticacion que verifica si está logueado
//se le pueden pasar roles a través 'expectedRoles' del objeto data en archivo routes
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const spinnerService = inject(EventBusService);
  spinnerService.showSpinner()
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const expectedRoles: string[] = route.data['expectedRoles'];
  return tokenService.isLoggedIn.pipe(
    map(isLogged => {
      if (!isLogged) {
        const codeUrl = getOauth2Url();
        window.location.href = codeUrl;
        return false;
      }
      const userRoles = tokenService.getAuthorities();
      const hasMatchingRole = expectedRoles.some(role => userRoles.includes(role));
      if (!hasMatchingRole) {
        spinnerService.hideSpinner()
        router.navigate(['/unauthorized']);
        return false;
      }
      spinnerService.hideSpinner()
      return true;
    }),
    catchError(() => {
      spinnerService.hideSpinner()
      const codeUrl = getOauth2Url();
      window.location.href = codeUrl;
      return of(false);
    })
  );
}
