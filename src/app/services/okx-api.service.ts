import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OkxApiService {
  private baseUrl = environment.okxAPI;

  // Your API credentials from OKX
  private apiKey = environment.apiKey;
  private secretKey = environment.secretKey;
  private passphrase = environment.passphrase;

  constructor(private http: HttpClient) {}

  // Public endpoints (no authentication required)
  public getTicker(symbol: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/market/ticker?instId=${symbol}`);
  }

  public getInstruments(instType: string = 'SPOT'): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/public/instruments?instType=${instType}`
    );
  }

  // Private endpoints (authentication required)
  public getAccountBalance(): Observable<any> {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const requestPath = '/account/balance';
    const body = '';

    const headers = this.getSignedHeaders(timestamp, method, requestPath, body);

    return this.http.get(`${this.baseUrl}${requestPath}`, { headers });
  }

  public placeOrder(params: any): Observable<any> {
    const timestamp = new Date().toISOString();
    const method = 'POST';
    const requestPath = '/trade/order';
    const body = JSON.stringify(params);

    const headers = this.getSignedHeaders(timestamp, method, requestPath, body);

    return this.http.post(`${this.baseUrl}${requestPath}`, body, { headers });
  }

  // Helper method to generate signed headers for authenticated requests
  private getSignedHeaders(
    timestamp: string,
    method: string,
    requestPath: string,
    body: string
  ): HttpHeaders {
    // Create the signature as per OKX documentation
    const message = timestamp + method + requestPath + body;
    const signature = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(message, this.secretKey)
    );

    // Return the required headers
    return new HttpHeaders({
      'OK-ACCESS-KEY': this.apiKey,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': this.passphrase,
      'Content-Type': 'application/json',
    });
  }
}
