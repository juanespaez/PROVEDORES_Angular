import { SecurityContext } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';

//funcion que se llama desde el app config 
//para que sanitize todos los inputs en el arranque de la aplicación
declare module '@angular/forms' {
  interface FormControl {
    _oldSetValue?: any;
  }
}

export function sanitizeInputFactory(sanitizer: DomSanitizer) {
  return () => {
    FormControl.prototype['_oldSetValue'] = FormControl.prototype.setValue;
    FormControl.prototype.setValue = function (value: any, options: any) {
      const sanitizedValue: SafeValue = sanitizer.sanitize(
        SecurityContext.HTML,
        value
      ) as SafeValue;
      arguments[0] = sanitizedValue || '';
      return this['_oldSetValue'](...arguments);
    };
  };
}