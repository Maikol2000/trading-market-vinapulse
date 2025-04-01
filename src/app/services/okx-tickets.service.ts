import { Injectable } from '@angular/core';
import { IOkxTicker } from '@app/type/ticket';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OkxTicketService {
  private socket: WebSocket | null = null;
  private readonly baseUrl = 'https://ws.okx.com/ws/v5/public';
  private readonly pingInterval = 30000; // 30 giây
  private readonly pingMessage = { event: 'ping' };
  private tickersSubject = new BehaviorSubject<IOkxTicker[]>([]);
  public tickers$ = this.tickersSubject.asObservable();

  constructor() {}

  /**
   * Kết nối tới WebSocket OKX
   */
  public connect(instruments: string[] = ['BTC-USDT', 'ETH-USDT']): boolean | void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket đã được kết nối');
      return;
    }

    this.socket = new WebSocket(this.baseUrl);

    this.socket.onopen = () => {
      console.log('Kết nối WebSocket thành công');
      this.subscribe(instruments);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onerror = (error) => {
      console.error('Lỗi WebSocket:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket đã đóng');
      // Kết nối lại sau 5 giây
      setTimeout(() => {
        this.connect();
      }, this.pingInterval);
    };
  }

  /**
   * Đăng ký kênh tickers với các cặp tiền tệ
   * @param instruments Danh sách các cặp tiền tệ (BTC-USDT và ETH-USDT)
   */
  public subscribe(instruments: string[]): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket chưa được kết nối');
      return;
    }

    const subscriptionRequest = {
      op: 'subscribe',
      args: instruments.map((instId) => ({
        channel: 'tickers',
        instId: instId,
      })),
    };

    this.socket.send(JSON.stringify(subscriptionRequest));
  }

  /**
   * Xử lý tin nhắn nhận được từ WebSocket
   */
  private handleMessage(data: any): void {
    // Xử lý tin nhắn ping từ server
    if (data.event === 'ping') {
      this.socket?.send(JSON.stringify({ event: this.pingMessage }));
      return;
    }

    // Xử lý dữ liệu tickers
    if (data.data && data.arg && data.arg.channel === 'tickers') {
      const currentTickers = [...this.tickersSubject.value];
      const newTicker = data.data[0];

      // Cập nhật hoặc thêm ticker mới
      const existingIndex = currentTickers.findIndex(
        (t) => t.instId === newTicker.instId
      );
      if (existingIndex >= 0) {
        currentTickers[existingIndex] = newTicker;
      } else {
        currentTickers.push(newTicker);
      }

      this.tickersSubject.next(currentTickers);
    }
  }

  /**
   * Ngắt kết nối WebSocket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Lấy dữ liệu ticker cho một cặp tiền tệ cụ thể
   * @param instId Mã cặp tiền tệ
   */
  public getTickerByInstId(instId: string): Observable<IOkxTicker | undefined> {
    return new Observable((observer) => {
      const subscription = this.tickers$.subscribe((tickers) => {
        const ticker = tickers.find((t) => t.instId === instId);
        observer.next(ticker);
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }
}
