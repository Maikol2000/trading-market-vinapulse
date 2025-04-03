import { Injectable } from '@angular/core';
import {
  OKSModelResponse,
  subscribeChannelsCandleType,
} from '@app/shared/models';
import { ApiOKSService } from '@app/shared/services';
import { environment } from '@env/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ICandleData } from '../models/candle';

@Injectable({
  providedIn: 'root',
})
export class CandlestickService {
  private wsUrl = environment.wsUrl + '/business';
  private timer!: ReturnType<typeof setInterval>;
  private timerConnect!: ReturnType<typeof setTimeout>;

  public series$ = new BehaviorSubject<Partial<ICandleData>>({});
  private socket: WebSocket | null = null;

  constructor(private okxService: ApiOKSService) {}

  // socket
  connectWebSocket(instId?: string, timeframe?: subscribeChannelsCandleType) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    this.socket = new WebSocket(this.wsUrl);

    this.socket.onopen = () => {
      this.subscribeToCandlestick(instId, timeframe);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.updateCandlestick(data.data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      this.timerConnect = setTimeout(() => {
        this.connectWebSocket();
      }, 5000);
    };
  }

  updateCandlestick(candleData: any) {
    if (!candleData || candleData.length === 0) return;
    const candle = candleData[0];
    const formattedData = {
      x: new Date(+candle[0]),
      y: [
        parseFloat(candle[1]), // Open
        parseFloat(candle[2]), // High
        parseFloat(candle[3]), // Low
        parseFloat(candle[4]), // Close
      ],
      vol: parseFloat(candle[6]),
    };

    this.series$.next(formattedData);
  }

  subscribeToCandlestick(
    instId?: string,
    timeframe?: subscribeChannelsCandleType
  ) {
    const message = {
      op: 'subscribe',
      args: [
        {
          channel: timeframe ?? 'candle1m',
          instId: instId ?? 'BTC-USDT',
        },
      ],
    };
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  }

  setTimer(interval: number) {
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.close();
      }
    }, interval);
  }

  clearTimer() {
    if (this.timer) clearInterval(this.timer);
  }

  /**
   * Đóng kết nối WebSocket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.timer) clearInterval(this.timer);
    if (this.timerConnect) clearTimeout(this.timerConnect);
  }

  // history-candles
  getHistoryCandles(instId: string): Observable<ICandleData[]> {
    return this.okxService
      .getOKX<OKSModelResponse<string[][]>>(
        `/market/history-candles?instId=${instId}`
      )
      .pipe(
        map(({ data }) =>
          data.map((d: string[]) => ({
            x: new Date(+d[0]),
            y: [
              parseFloat(d[1]), // Open
              parseFloat(d[2]), // High
              parseFloat(d[3]), // Low
              parseFloat(d[4]), // Close
            ],
            vol: parseFloat(d[6]),
          }))
        )
      );
  }
}
