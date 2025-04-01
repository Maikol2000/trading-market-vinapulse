import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  interval,
  BehaviorSubject,
  Subject,
  from,
  forkJoin,
} from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { ICryptoTrade } from '@app/type/crypto-trade';

@Injectable({
  providedIn: 'root',
})
export class OkxApiService {
  private baseUrl = 'https://www.okx.com/api/v5';
  private cryptoTradesSubject = new BehaviorSubject<ICryptoTrade[]>([]);
  private wsSubject = new Subject<any>();
  private ws: WebSocket | null = null;

  // Danh sách các cặp tiền tệ muốn theo dõi
  private watchSymbols = [
    'BTC-USDT',
    'ETH-USDT',
    'SOL-USDT',
    'XRP-USDT',
    'ADA-USDT',
    'DOGE-USDT',
    'DOT-USDT',
    'LTC-USDT',
  ];

  cryptoTrades$ = this.cryptoTradesSubject.asObservable();
  wsMessages$ = this.wsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Khởi tạo kết nối và cập nhật dữ liệu
  initialize(): void {
    // Đầu tiên lấy dữ liệu ban đầu qua REST API
    this.loadInitialData();

    // Sau đó thiết lập WebSocket để cập nhật real-time
    this.setupWebSocket();

    // Cập nhật dữ liệu mỗi 10 giây để đảm bảo tính chính xác
    interval(10000).subscribe(() => {
      this.updateAllData();
    });
  }

  // Lấy dữ liệu ban đầu
  loadInitialData(): void {
    const requests = this.watchSymbols.map((symbol) =>
      this.fetchCryptoTradeData(symbol)
    );

    forkJoin(requests)
      .pipe(
        map(
          (results) =>
            results.filter((result) => result !== null) as ICryptoTrade[]
        )
      )
      .subscribe(
        (trades) => {
          this.cryptoTradesSubject.next(trades);
        },
        (error) => {
          console.error('Error loading initial data:', error);
        }
      );
  }

  // Cập nhật tất cả dữ liệu
  updateAllData(): void {
    const currentTrades = this.cryptoTradesSubject.value;
    const requests = this.watchSymbols.map((symbol) =>
      this.fetchCryptoTradeData(symbol)
    );

    forkJoin(requests)
      .pipe(
        map(
          (results) =>
            results.filter((result) => result !== null) as ICryptoTrade[]
        )
      )
      .subscribe(
        (newTrades) => {
          // Cập nhật dữ liệu với giá trị mới
          const updatedTrades = currentTrades.map((currentTrade) => {
            const newTrade = newTrades.find(
              (nt) => nt.symbol === currentTrade.symbol
            );
            return newTrade || currentTrade;
          });

          // Thêm bất kỳ cặp tiền tệ mới nào
          newTrades.forEach((newTrade) => {
            if (!updatedTrades.some((ut) => ut.symbol === newTrade.symbol)) {
              updatedTrades.push(newTrade);
            }
          });

          this.cryptoTradesSubject.next(updatedTrades);
        },
        (error) => {
          console.error('Error updating data:', error);
        }
      );
  }

  // Thiết lập WebSocket để nhận dữ liệu real-time
  setupWebSocket(): void {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');

    this.ws.onopen = () => {
      console.log('WebSocket connected');

      // Đăng ký kênh ticker cho tất cả các cặp tiền tệ
      const subscribeMsg = {
        op: 'subscribe',
        args: this.watchSymbols.map((symbol) => ({
          channel: 'tickers',
          instId: symbol,
        })),
      };

      // Đăng ký kênh trades cho cập nhật giao dịch mới nhất
      const tradeSubscribeMsg = {
        op: 'subscribe',
        args: this.watchSymbols.map((symbol) => ({
          channel: 'trades',
          instId: symbol,
        })),
      };

      // Đăng ký kênh order book cho thông tin mua/bán
      const bookSubscribeMsg = {
        op: 'subscribe',
        args: this.watchSymbols.map((symbol) => ({
          channel: 'books',
          instId: symbol,
        })),
      };

      this.ws.send(JSON.stringify(subscribeMsg));
      this.ws.send(JSON.stringify(tradeSubscribeMsg));
      this.ws.send(JSON.stringify(bookSubscribeMsg));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.wsSubject.next(data);

      // Xử lý cập nhật dữ liệu từ WebSocket
      this.processWebSocketMessage(data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Thử kết nối lại sau 5 giây
      setTimeout(() => this.setupWebSocket(), 5000);
    };
  }

  // Xử lý tin nhắn từ WebSocket
  processWebSocketMessage(message: any): void {
    // Xử lý cập nhật ticker
    if (message.data && message.arg && message.arg.channel === 'tickers') {
      const tickerData = message.data[0];
      const symbol = message.arg.instId;

      const currentTrades = this.cryptoTradesSubject.value;
      const tradeIndex = currentTrades.findIndex(
        (trade) => trade.symbol === symbol
      );

      if (tradeIndex >= 0) {
        // Cập nhật dữ liệu hiện có
        const updatedTrade = { ...currentTrades[tradeIndex] };
        updatedTrade.lastPrice = parseFloat(tickerData.last);
        updatedTrade.change24h = parseFloat(tickerData.change24h);
        updatedTrade.changePercent24h =
          parseFloat(tickerData.changeRate24h) * 100;
        updatedTrade.timestamp = Date.now();

        const updatedTrades = [...currentTrades];
        updatedTrades[tradeIndex] = updatedTrade;
        this.cryptoTradesSubject.next(updatedTrades);
      }
    }

    // Xử lý cập nhật trades
    if (message.data && message.arg && message.arg.channel === 'trades') {
      const tradeData = message.data[0];
      const symbol = message.arg.instId;

      const currentTrades = this.cryptoTradesSubject.value;
      const tradeIndex = currentTrades.findIndex(
        (trade) => trade.symbol === symbol
      );

      if (tradeIndex >= 0) {
        // Cập nhật dữ liệu giao dịch mới nhất
        const updatedTrade = { ...currentTrades[tradeIndex] };
        updatedTrade.lastPrice = parseFloat(tradeData.px);
        updatedTrade.lastVolume = parseFloat(tradeData.sz);
        updatedTrade.timestamp = Date.now();

        // Cập nhật thông tin mua/bán dựa trên phía giao dịch
        if (tradeData.side === 'buy') {
          updatedTrade.buyPrice = parseFloat(tradeData.px);
          updatedTrade.buyVolume = parseFloat(tradeData.sz);
        } else if (tradeData.side === 'sell') {
          updatedTrade.sellPrice = parseFloat(tradeData.px);
          updatedTrade.sellVolume = parseFloat(tradeData.sz);
        }

        const updatedTrades = [...currentTrades];
        updatedTrades[tradeIndex] = updatedTrade;
        this.cryptoTradesSubject.next(updatedTrades);
      }
    }

    // Xử lý cập nhật sổ lệnh
    if (message.data && message.arg && message.arg.channel === 'books') {
      const bookData = message.data[0];
      const symbol = message.arg.instId;

      if (
        bookData.asks &&
        bookData.asks.length > 0 &&
        bookData.bids &&
        bookData.bids.length > 0
      ) {
        const currentTrades = this.cryptoTradesSubject.value;
        const tradeIndex = currentTrades.findIndex(
          (trade) => trade.symbol === symbol
        );

        if (tradeIndex >= 0) {
          const updatedTrade = { ...currentTrades[tradeIndex] };

          // Cập nhật thông tin mua/bán từ sổ lệnh
          updatedTrade.sellPrice = parseFloat(bookData.asks[0][0]);
          updatedTrade.sellVolume = parseFloat(bookData.asks[0][1]);
          updatedTrade.buyPrice = parseFloat(bookData.bids[0][0]);
          updatedTrade.buyVolume = parseFloat(bookData.bids[0][1]);

          const updatedTrades = [...currentTrades];
          updatedTrades[tradeIndex] = updatedTrade;
          this.cryptoTradesSubject.next(updatedTrades);
        }
      }
    }
  }

  // Fetch dữ liệu cho một cặp tiền tệ cụ thể
  fetchCryptoTradeData(symbol: string): Observable<ICryptoTrade | null> {
    // Lấy thông tin ticker
    return this.http
      .get<any>(`${this.baseUrl}/market/ticker?instId=${symbol}`)
      .pipe(
        switchMap((tickerResp) => {
          if (
            tickerResp.code !== '0' ||
            !tickerResp.data ||
            tickerResp.data.length === 0
          ) {
            throw new Error(`Failed to fetch ticker for ${symbol}`);
          }

          const ticker = tickerResp.data[0];

          // Lấy thông tin limit up/down (trần/sàn)
          return this.http
            .get<any>(`${this.baseUrl}/market/limit-price?instId=${symbol}`)
            .pipe(
              map((limitResp) => {
                if (
                  limitResp.code !== '0' ||
                  !limitResp.data ||
                  limitResp.data.length === 0
                ) {
                  // Nếu không có dữ liệu giới hạn, tính toán giá trị mặc định
                  const lastPrice = parseFloat(ticker.last);
                  return {
                    buyLimit: lastPrice * 1.1, // +10%
                    sellLimit: lastPrice * 0.9, // -10%
                  };
                }

                const limitData = limitResp.data[0];
                return {
                  buyLimit: parseFloat(limitData.buyLmt),
                  sellLimit: parseFloat(limitData.sellLmt),
                };
              }),
              map(({ buyLimit, sellLimit }) => {
                // Lấy thông tin sổ lệnh để tìm các lệnh mua/bán tốt nhất
                return {
                  symbol,
                  ceiling: buyLimit,
                  floor: sellLimit,
                  buyPrice: parseFloat(ticker.bidPx) || 0,
                  buyVolume: parseFloat(ticker.bidSz) || 0,
                  sellPrice: parseFloat(ticker.askPx) || 0,
                  sellVolume: parseFloat(ticker.askSz) || 0,
                  lastPrice: parseFloat(ticker.last),
                  lastVolume: parseFloat(ticker.vol24h),
                  change24h: parseFloat(ticker.change24h),
                  changePercent24h: parseFloat(ticker.changeRate24h) * 100,
                  timestamp: Date.now(),
                };
              })
            );
        }),
        catchError((error) => {
          console.error(`Error fetching data for ${symbol}:`, error);
          return from([null]);
        })
      );
  }

  // Ngắt kết nối khi service bị hủy
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
