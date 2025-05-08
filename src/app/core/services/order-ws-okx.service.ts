import { Injectable } from '@angular/core';
import { ApiOKSService } from '@app/shared/services';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { IOKXTicker } from '../models';
import { OKSModelResponse } from '@app/shared/models';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderWSOKXService {
  private readonly OKX_API_URL = environment.wsUrl + '/public';

  private tickerSubject = new BehaviorSubject<IOKXTicker | null>(null);
  public ticker$ = this.tickerSubject.asObservable();
  private webSocket: WebSocket | null = null;

  constructor(private http: ApiOKSService) {}

  // Get initial ticker data
  getTickerData(symbol: string): Observable<OKSModelResponse<IOKXTicker[]>> {
    return this.http.getOKX<OKSModelResponse<IOKXTicker[]>>(
      `/market/ticker?instId=${symbol}`
    );
  }

  // Connect to WebSocket for real-time updates
  connectWebSocket(symbol: string): void {
    if (this.webSocket) {
      this.webSocket.close();
    }

    this.webSocket = new WebSocket(this.OKX_API_URL);

    this.webSocket.onopen = () => {
      const subscribeMsg = {
        op: 'subscribe',
        args: [
          {
            channel: 'tickers',
            instId: symbol,
          },
        ],
      };
      if (this.webSocket) {
        this.webSocket.send(JSON.stringify(subscribeMsg));
      }
    };

    this.webSocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.data && response.data.length > 0) {
        this.tickerSubject.next(response.data[0]);
      }
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.webSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  disconnectWebSocket(): void {
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
  }

  // Fallback method using polling if WebSockets aren't available
  startPolling(symbol: string, intervalTIme: number = 5000): void {
    interval(intervalTIme)
      .pipe(
        switchMap(() => this.getTickerData(symbol)),
        tap((response) => {
          if (response.data && response.data.length > 0) {
            this.tickerSubject.next(response.data[0]);
          }
        })
      )
      .subscribe();
  }
}
