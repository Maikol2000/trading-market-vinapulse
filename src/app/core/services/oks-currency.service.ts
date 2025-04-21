import { Injectable } from '@angular/core';
import { IOKXTicker } from '@app/core/models';
import { WSMessage } from '@app/core/models/ws-message';
import { OKSModelResponse } from '@app/shared/models';
import { ApiOKSService } from '@app/shared/services';
import { environment } from '@env/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OKXCurrencyService {
  private wsUrl = environment.wsUrl + '/public';

  private socket: WebSocket | null = null;
  private currenciesSubject = new BehaviorSubject<IOKXTicker[]>([]);
  currencies$ = this.currenciesSubject.asObservable();

  private readonly pingInterval = 30000; // 30 giây

  constructor(private http: ApiOKSService) {}

  /**
   * Kết nối tới WebSocket OKX
   */
  public connect(instruments: string[]): boolean | void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket đã được kết nối');
      return;
    }

    this.socket = new WebSocket(this.wsUrl);

    this.socket.onopen = () => {
      console.log('Kết nối WebSocket thành công');
      this.subscribe(instruments);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleWebSocketMessage(data);
    };

    this.socket.onerror = (error) => {
      console.error('Lỗi WebSocket:', error);
    };

    // this.socket.onclose = () => {
    //   console.log('WebSocket đã đóng');
    //   // Kết nối lại sau 5 giây
    //   setTimeout(() => {
    //     this.connect([]);
    //   }, this.pingInterval);
    // };
  }

  /**
   * Kết nối tới WebSocket để nhận dữ liệu real-time
   */
  subscribe(
    symbols: string[] = ['BTC-USDT', 'ETH-USDT', 'XRP-USDT', 'LTC-USDT']
  ): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket chưa được kết nối');
      return;
    }

    // Đăng ký nhận updates cho các cặp tiền tệ
    const subscriptionMsg = {
      op: 'subscribe',
      args: symbols.map((symbol) => ({
        channel: 'tickers',
        instId: symbol,
      })),
    };

    this.socket.send(JSON.stringify(subscriptionMsg));
  }

  /**
   * Xử lý dữ liệu từ WebSocket
   */
  private handleWebSocketMessage(message: WSMessage): void {
    // Xử lý tin nhắn ping từ server
    if (message.op === 'ping') {
      this.socket?.send(JSON.stringify({ event: 'ping' }));
      return;
    }

    // Xử lý dữ liệu tickers
    if (message.data && message.arg && message.arg.channel === 'tickers') {
      const currentTickers = [...this.currenciesSubject.value];
      const newTicker = message.data[0];

      const existingIndex = currentTickers.findIndex(
        (t) => t.instId === newTicker.instId
      );
      if (existingIndex >= 0) {
        currentTickers[existingIndex] = newTicker;
      } else {
        currentTickers.push(newTicker);
      }

      this.currenciesSubject.next(currentTickers);
    }
  }

  getInitialTickers(instType: string = 'SWAP'): void {
    // Gọi API để lấy dữ liệu ban đầu
    const resp = this.http.getOKX<OKSModelResponse<IOKXTicker[]>>(
      `/market/tickers?instType=${instType}&uly=BTC-USD`
    );
    resp.subscribe((res) => {
      this.currenciesSubject.next(res.data);
    });
  }

  /**
   * Đóng kết nối WebSocket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
