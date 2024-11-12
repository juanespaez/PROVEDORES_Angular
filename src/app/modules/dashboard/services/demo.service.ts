import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericResponse } from '../models/generic-response';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  private serviceDemoRoute: string;

  constructor(private http: HttpClient) {
    this.serviceDemoRoute = environment.backendApiRoute
  }

  getInfo(parm01: string, recaptchaToken: string): Observable<GenericResponse> {
    const url_request = `${this.serviceDemoRoute}?parm01=${parm01}`;
    return this.http.get<GenericResponse>(url_request, {
      headers: {
        'recaptcha-token': recaptchaToken
      }
    });
  }
}
