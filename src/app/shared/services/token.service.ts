import { Injectable } from '@angular/core';
import { Buffer } from 'buffer'
import { SessionStorageService } from './session-storage.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

//servicio que contiene todos los métodos referentes a los tokens
//tales como almacenarlos y recuperarlos del sesion storage, obtener informacion del auth token
//como por ejemplo los roles o tiempo de expiración para validaciones, etc.
const TOKEN_KEY = 'TOKEN_KEY';
const TOKEN_REF = 'TOKEN_REF';
const USER = 'USER';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private sessionStorageService: SessionStorageService) { }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  public updateLoggedInStatus(isLoggedIn: boolean) {
    this.loggedIn.next(isLoggedIn);
  }

  public setToken(token: string): void {
    this.sessionStorageService.removeItem(TOKEN_KEY);
    this.sessionStorageService.setItem(TOKEN_KEY, token);
  }

  public setTokenRefresh(tokenRf: string): void {
    this.sessionStorageService.removeItem(TOKEN_REF);
    this.sessionStorageService.setItem(TOKEN_REF, tokenRf);
  }

  public getToken(): string {
    try {
      return this.sessionStorageService.getItem<string>(TOKEN_KEY) ?? '';
    } catch (error) {
      throw error
    }
  }

  public getTokenRefresh(): string {
    return this.sessionStorageService.getItem<string>(TOKEN_REF) ?? '';
  }

  public getUser(): string {
    return this.sessionStorageService.getItem<string>(USER) ?? '';
  }

  public isLogged(): boolean {
    if (this.getToken()) {
      return true
    }
    return false
  }

  public hasValidToken(): boolean {
    try {
      const values = this.decodeToken();
      let owner: string = ''
      let exp: number = 0
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      if (values) {
        exp = values.exp
        owner = values.owner
      }
      if (owner === '' || owner !== environment.client_id) {
        throw new Error('Invalid token owner');
      }
      if (exp === 0 || exp < currentTimeInSeconds) {
        return false;
      }
      return true;
    } catch (error) {
      throw error
    }
  }

  public hasToken(): boolean {
    try {
      return !!this.getToken();
    } catch (error) {
      throw error
    }
  }

  public hasRefreshToken(): boolean {
    try {
      return !!this.getTokenRefresh();
    } catch (error) {
      throw error
    }
  }

  public getClientId(): string {
    const values = this.decodeToken();
    if (values) {
      return values.owner;
    }
    return '';
  }

  public getAuthorities(): string[] {
    const values = this.decodeToken();
    if (values) {
      return values.roles;
    }
    return [];
  }

  public decodeToken(): any {
    if (!this.isLogged()) {
      return null;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = Buffer.from(payload, 'base64').toString('ascii');
    const values = JSON.parse(payloadDecoded);
    return values;
  }
}
