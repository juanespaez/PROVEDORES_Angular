import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { DomSanitizer } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { sanitizeInputFactory } from '@shared/utils/sanitizeInputFactory';
import { InterceptorService } from '@shared/services/interceptor.service';
import { RecaptchaCustomModule } from '@shared/ngModules/dashboard/recaptcha-custom.module';

const allRoutes = [...routes];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(allRoutes),
    {
      provide: APP_INITIALIZER,
      useFactory: sanitizeInputFactory,
      deps: [DomSanitizer],
      multi: true
    },
    provideHttpClient(withInterceptors([InterceptorService])),
    importProvidersFrom(
      RecaptchaCustomModule
    ),
    provideAnimations(),
  ]
};
