import { Injectable } from '@angular/core';
import { StorageService } from '@shared/models/storage';

//servicio que extiende el sesion storage custom para encriptación
//este servicio se llama donde se desee hacer uso del getItem o setItem
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService extends StorageService {

  constructor() {
    super(window.sessionStorage)
  }
}
