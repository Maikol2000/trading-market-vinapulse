import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiOKSService {
  private readonly baseUrl = environment.okxAPI; // Add this to your environment files

  constructor(private http: HttpClient) {}

  // Headers configuration for OKX API
  private getHeaders(needAuth: boolean = false): HttpHeaders {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    if (needAuth) {
      const timestamp = new Date().toISOString();
      headers = headers
        .set('OK-ACCESS-KEY', environment.okxAPI)
        .set('OK-ACCESS-TIMESTAMP', timestamp)
        .set('OK-ACCESS-PASSPHRASE', environment.passphrase);
    }

    return headers;
  }

  public getOKX<T>(endpoint: string, needAuth: boolean = false): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders(needAuth),
    });
  }

  public postOKX<T>(
    endpoint: string,
    data: T,
    needAuth: boolean = false
  ): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, {
      headers: this.getHeaders(needAuth),
    });
  }
}
