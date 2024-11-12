import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RecaptchaV3Module } from 'ng-recaptcha-2';
import { environment } from '../../../../environments/environment';

//modulo custom para reunir las dependencias y providers que requiere el recaptcha
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaV3Module
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.RECAPTCHA_V3_SITE_KEY
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.RECAPTCHA_V3_SITE_KEY,
      } as RecaptchaSettings,
    },
  ],
  exports: [
    CommonModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaV3Module
  ]
})
export class RecaptchaCustomModule { }
