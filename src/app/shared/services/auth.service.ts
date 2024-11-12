import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//servicio para obtener el auth token y el refresh token
//para el refresh debe mandarse el segundo parámetro en true
const oauth = environment.oauth
const headers = {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
'Authorization': 'Basic ' + btoa(oauth)
})};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token_url = environment.token_url

  constructor(private httpClient: HttpClient) { }

  public getToken(codeOrToken: string, isRefresh?: boolean): Observable<any> {
    isRefresh = isRefresh ?? false
    let body = new URLSearchParams();
    body.set('grant_type', isRefresh ? environment.grant_type_refresh : environment.grant_type_auth);
    body.set('redirect_uri', environment.redirect_uri);
    body.set(isRefresh ? 'refresh_token' : 'code', codeOrToken);
    return this.httpClient.post<any>(this.token_url, body, headers)
  }
}
