import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Generic GET request
   * @param endpoint API endpoint
   * @param params Optional query parameters
   * @param requireAuth Whether the request requires authentication
   */
  public get<T>(endpoint: string, requireAuth: boolean = true): Observable<T> {
    const headers = this.getHeaders(requireAuth);
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers,
      withCredentials: true,
    });
  }

  /**
   * Generic POST request
   * @param endpoint API endpoint
   * @param body Request body
   * @param requireAuth Whether the request requires authentication
   */
  public post<T>(
    endpoint: string,
    body?: any,
    requireAuth: boolean = false
  ): Observable<T> {
    const headers = this.getHeaders(requireAuth);
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      headers,
      withCredentials: true,
    });
  }

  /**
   * Generic PUT request
   * @param endpoint API endpoint
   * @param body Request body
   * @param requireAuth Whether the request requires authentication
   */
  public put<T>(
    endpoint: string,
    body: any,
    requireAuth: boolean = true
  ): Observable<T> {
    const headers = this.getHeaders(requireAuth);
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      headers,
      withCredentials: true,
    });
  }

  /**
   * Generic DELETE request
   * @param endpoint API endpoint
   * @param requireAuth Whether the request requires authentication
   */
  public delete<T>(
    endpoint: string,
    requireAuth: boolean = true
  ): Observable<T> {
    const headers = this.getHeaders(requireAuth);
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers,
      withCredentials: true,
    });
  }

  /**
   * Configure request options including headers and params
   */
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

  /**
   * Upload file(s)
   * @param endpoint API endpoint
   * @param files Files to upload
   * @param extraData Additional form data
   */
  public uploadFiles<T>(
    endpoint: string,
    files: File[],
    extraData?: { [key: string]: any }
  ): Observable<T> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    if (extraData) {
      Object.keys(extraData).forEach((key) => {
        formData.append(key, extraData[key]);
      });
    }

    const headers = new HttpHeaders();
    // Don't set Content-Type, let browser set it with boundary
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData, {
      headers,
    });
  }
}
