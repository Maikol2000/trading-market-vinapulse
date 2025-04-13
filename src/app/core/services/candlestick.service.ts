import { Injectable } from '@angular/core';
import {
  OKSModelResponse,
  subscribeChannelsCandleType,
} from '@app/shared/models';
import { ApiOKSService } from '@app/shared/services';
import { environment } from '@env/environment';
import { CandlestickData, HistogramData, Time } from 'lightweight-charts';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface DataMarket {
  candles: CandlestickData[];
  volumes: HistogramData[];
}

@Injectable({
  providedIn: 'root',
})
export class CandlestickService {
  private wsUrl = environment.wsUrl + '/business';
  private timer!: ReturnType<typeof setInterval>;
  private timerConnect!: ReturnType<typeof setTimeout>;

  public series$ = new BehaviorSubject<Partial<CandlestickData>>({});
  private socket: WebSocket | null = null;

  constructor(private okxService: ApiOKSService) {}

  // socket
  connectWebSocket(symbol?: string, timeframe?: subscribeChannelsCandleType) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }
    this.socket = new WebSocket(this.wsUrl);

    this.socket.onopen = () => {
      this.subscribeToCandlestick(symbol, timeframe);
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
    const formattedData: Partial<CandlestickData> = {
      time: (new Date(+candle[0]).getTime() / 1000) as Time,
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
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
  getHistoryMarkets(instId: string): Observable<DataMarket> {
    return this.okxService
      .getOKX<OKSModelResponse<string[][]>>(
        `/market/history-candles?instId=${instId}`
      )
      .pipe(
        map((data) => {
          return data.data.sort((a, b) => Number(a[0]) - Number(b[0]));
        }),
        map((data) => {
          const candles: CandlestickData[] = data.map((candle: string[]) => ({
            time: (new Date(+candle[0]).getTime() / 1000) as Time,
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
          }));
          const volumes: HistogramData[] = data.map((candle: string[]) => ({
            time: (new Date(+candle[0]).getTime() / 1000) as Time,
            value: parseFloat(candle[6]), // volume,
            color:
              parseFloat(candle[4]) >= parseFloat(candle[1]) // close >= open
                ? 'rgba(38, 166, 154, 0.5)'
                : 'rgba(239, 83, 80, 0.5)',
          }));
          return {
            candles,
            volumes,
          };
        })
      );
  }
}
