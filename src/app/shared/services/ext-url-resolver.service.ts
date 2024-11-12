import { NgZone, inject } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { Observable, of } from "rxjs";

export const resolverExtUrl: ResolveFn<any> = (route: ActivatedRouteSnapshot): Observable<null> => {
  const ngZone = inject(NgZone);
  const activatedRoute = inject(ActivatedRoute);
  activatedRoute.queryParams.subscribe(data => {
    if (data && 'url' in data) {
      ngZone.run(() => { window.location.href = route.queryParamMap.get('url') ?? '' });
    }
  });
  return of(null);
}
