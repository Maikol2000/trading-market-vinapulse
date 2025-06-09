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

  public serries$ = new BehaviorSubject<
    Partial<{ candles: CandlestickData; volumes: HistogramData }>
  >({});
  private socket: WebSocket | null = null;

  private symbol: string = '';
  private timeframe: subscribeChannelsCandleType = '1m';

  constructor(private okxService: ApiOKSService) {}

  // socket
  connectWebSocket() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    this.socket = new WebSocket(this.wsUrl);

    this.socket.onopen = () => {
      this.subscribeToCandlestick();
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

  updateCandlestick(candleData: string[][]) {
    if (!candleData || candleData.length === 0) return;
    const candle = candleData[0];
    const formattedData: CandlestickData = {
      time: (new Date(+candle[0]).getTime() / 1000) as Time,
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
    };
    const volumeData: HistogramData = {
      time: (new Date(+candle[0]).getTime() / 1000) as Time,
      value: parseFloat(candle[6]), // volume,
      color:
        parseFloat(candle[4]) >= parseFloat(candle[1]) // close >= open
          ? 'rgba(38, 166, 154, 0.5)'
          : 'rgba(239, 83, 80, 0.5)',
    };

    // this.volumes$.next(volumeData);
    this.serries$.next({
      candles: formattedData,
      volumes: volumeData,
    });
  }

  subscribeToCandlestick() {
    const message = {
      op: 'subscribe',
      args: [
        {
          channel: 'candle' + this.timeframe,
          instId: this.symbol ?? 'BTC-USDT',
        },
      ],
    };
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  }

  setSubcribe(symbol: string, timeframe: subscribeChannelsCandleType = '1m') {
    this.symbol = symbol;
    this.timeframe = timeframe;
    // this.connectWebSocket();
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
  getHistoryMarkets(
    symbol: string,
    timeframe: subscribeChannelsCandleType = '1H',
    limit: number = 100
  ): Observable<DataMarket> {
    return this.okxService
      .getOKX<OKSModelResponse<string[][]>>(
        `/market/candles?instId=${symbol}&bar=${timeframe}&limit=${limit}`
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
