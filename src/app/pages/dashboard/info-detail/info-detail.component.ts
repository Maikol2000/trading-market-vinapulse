import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TechnicalGaugeChartComponent } from '@app/components/dashboard/info-detail';
import { ICrystal } from '@app/core/models';
import { OrderWSOKXService } from '@app/core/services';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-info-detail',
  imports: [CommonModule, TechnicalGaugeChartComponent, TranslateModule],
  templateUrl: './info-detail.component.html',
  styleUrl: './info-detail.component.scss',
})
export class InfoDetailComponent {
  symbol: string = '';
  cryptoDetail = signal<Partial<ICrystal> | null>(null);
  websocketSubscription: Subscription | null = null;
  httpSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private ticketService: OrderWSOKXService
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.symbol = url[url.length - 1].path;
    });

    // Tải dữ liệu ban đầu qua HTTP
    this.loadInitialData();

    // Sau khi đã có dữ liệu ban đầu, bắt đầu kết nối WebSocket
    this.ticketService.connectWebSocket(this.symbol);

    this.websocketSubscription = this.ticketService.ticker$
      .pipe(debounceTime(200))
      .subscribe({
        next: (tickerData) => {
          if (tickerData) {
            this.updateCryptoDetailFromWebSocket(tickerData);
          }
        },
      });
  }

  ngOnDestroy(): void {
    // Hủy đăng ký WebSocket khi component bị hủy
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe();
    }

    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }

    this.ticketService.disconnectWebSocket();
  }

  /**
   * Tải dữ liệu ban đầu qua HTTP
   */
  loadInitialData(): void {
    this.httpSubscription = this.ticketService
      .getTickerData(this.symbol)
      .subscribe({
        next: (data: any) => {
          this.cryptoDetail.set(this.processTickerData(data));
        },
        error: (err: any) => {
          console.error('Error fetching initial crypto data:', err);
        },
      });
  }

  /**
   * Cập nhật dữ liệu từ WebSocket
   */
  updateCryptoDetailFromWebSocket(tickerData: any): void {
    if (!this.cryptoDetail) return;

    // Cập nhật các thông tin giá từ dữ liệu WebSocket

    this.cryptoDetail.update((v) => ({
      ...v,
      price: parseFloat(tickerData.last || this.cryptoDetail()?.price),
      high24h: parseFloat(tickerData.high24h || this.cryptoDetail()?.high24h),
      low24h: parseFloat(tickerData.low24h || this.cryptoDetail()?.low24h),
      openPrice: parseFloat(
        tickerData.open24h || this.cryptoDetail()?.openPrice
      ),
      closePrice: parseFloat(
        tickerData.last || this.cryptoDetail()?.closePrice
      ),
      volume24h: parseFloat(
        tickerData.volCcy24h || this.cryptoDetail()?.volume24h
      ),
      tradingVolume: parseFloat(
        tickerData.vol24h || this.cryptoDetail()?.tradingVolume
      ),
      priceChangePercent: parseFloat(tickerData.changeRate24h || '0') * 100,
      averagePrice:
        ((this.cryptoDetail()?.high24h ?? 0) +
          (this.cryptoDetail()?.low24h ?? 0)) /
        2,
      lastUpdated: new Date(),
    }));
  }

  /**
   * Xử lý dữ liệu từ API ticker
   */
  processTickerData(data: any): ICrystal {
    const ticker = data?.data?.[0] || {};

    return {
      symbol: this.symbol,
      name: this.getNameFromSymbol(this.symbol),
      marketCap: parseFloat(ticker.volCcy24h || '0'),
      price: parseFloat(ticker.last || '0'),
      circulatingSupply: 0, // Cần API bổ sung hoặc tính toán từ dữ liệu khác
      tradingVolume: parseFloat(ticker.vol24h || '0'),
      high24h: parseFloat(ticker.high24h || '0'),
      low24h: parseFloat(ticker.low24h || '0'),
      averagePrice:
        (parseFloat(ticker.high24h || '0') + parseFloat(ticker.low24h || '0')) /
        2,
      openPrice: parseFloat(ticker.open24h || '0'),
      closePrice: parseFloat(ticker.last || '0'),
      volume24h: parseFloat(ticker.volCcy24h || '0'),
      priceChangePercent: parseFloat(ticker.changeRate24h || '0') * 100,
      lastUpdated: new Date(),
    };
  }

  // Chuyển đổi symbol thành tên
  getNameFromSymbol(symbol: string): string {
    const symbolMap: { [key: string]: string } = {
      'BTC-USDT': 'Bitcoin',
      'ETH-USDT': 'Ethereum',
      'XRP-USDT': 'Ripple',
      'LTC-USDT': 'Litecoin',
      'SOL-USDT': 'Solana',
      'ADA-USDT': 'Cardano',
      'DOT-USDT': 'Polkadot',
      'DOGE-USDT': 'Dogecoin',
      // Thêm các cặp giao dịch khác nếu cần
    };

    return symbolMap[symbol] || symbol;
  }

  // Format số thành định dạng tiền tệ
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // Format số thành định dạng phần trăm
  formatPercent(value: number): string {
    return new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  }

  // Format số lớn
  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}
