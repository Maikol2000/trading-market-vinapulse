import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { IOrderBook, OrderBookLevel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OrderBookService {
  private readonly OKX_API_URL = environment.okxAPI + '/market/books';
  private readonly MAX_LEVELS = 10; // Number of price levels to display
  private readonly REFRESH_INTERVAL = 5000; // Refresh every second

  private orderBookSubject = new BehaviorSubject<IOrderBook | null>(null);
  public orderBook$ = this.orderBookSubject.asObservable();

  private currentSymbol = 'BTC-USDT';
  private isStreamingActive = false;

  constructor(private http: HttpClient) {}

  public startStreaming(symbol: string = 'BTC-USDT'): void {
    if (this.isStreamingActive) {
      this.stopStreaming();
    }

    this.currentSymbol = symbol;
    this.isStreamingActive = true;

    // Setup polling with RxJS timer
    timer(0, this.REFRESH_INTERVAL)
      .pipe(
        switchMap(() => this.fetchOrderBook(this.currentSymbol)),
        tap((orderBook) => this.orderBookSubject.next(orderBook)),
        shareReplay(1)
      )
      .subscribe();
  }

  public stopStreaming(): void {
    this.isStreamingActive = false;
    // No need to unsubscribe as we're not storing the subscription
  }

  public changeSymbol(symbol: string): void {
    if (this.currentSymbol !== symbol) {
      this.currentSymbol = symbol;
      if (this.isStreamingActive) {
        this.startStreaming(symbol);
      }
    }
  }

  private fetchOrderBook(symbol: string): Observable<IOrderBook> {
    const params = {
      instId: symbol,
      sz: '50', // Request more levels than we display
    };

    return this.http.get<any>(`${this.OKX_API_URL}`, { params }).pipe(
      map((response) => {
        if (!response.data || !response.data[0]) {
          throw new Error('Invalid order book data received');
        }

        const rawData = response.data[0];
        return this.processOrderBookData(rawData);
      })
    );
  }

  private processOrderBookData(data: any): IOrderBook {
    // Extract asks and bids
    const rawAsks = data.asks || [];
    const rawBids = data.bids || [];

    // Process asks (sell orders) - lowest asks first
    const asks = this.processLevels(rawAsks, 'ask')
      .sort((a, b) => a.price - b.price)
      .slice(0, this.MAX_LEVELS);

    // Process bids (buy orders) - highest bids first
    const bids = this.processLevels(rawBids, 'bid')
      .sort((a, b) => b.price - a.price)
      .slice(0, this.MAX_LEVELS);

    // Calculate spread
    const lowestAsk = asks[0]?.price;
    const highestBid = bids[0]?.price;

    const spread = lowestAsk && highestBid ? lowestAsk - highestBid : 0;
    const spreadPercentage = lowestAsk ? (spread / lowestAsk) * 100 : 0;

    return {
      asks,
      bids,
      spread,
      spreadPercentage,
      timestamp: parseInt(data.ts) || Date.now(),
    };
  }

  private processLevels(levels: any[], type: 'ask' | 'bid'): OrderBookLevel[] {
    // OKX API returns [price, size, orders] for each level
    const parsed = levels.map((level) => ({
      price: parseFloat(level[0]),
      size: parseFloat(level[1]),
    }));

    // Calculate cumulative sizes
    let runningTotal = 0;
    const withTotals = parsed.map((level) => {
      runningTotal += level.size;
      return {
        ...level,
        total: runningTotal,
        percentage: 0, // Will be calculated after finding max
      };
    });

    // Calculate percentages relative to max total
    const maxTotal = runningTotal;
    return withTotals.map((level) => ({
      ...level,
      percentage: (level.total / maxTotal) * 100,
    }));
  }
}
