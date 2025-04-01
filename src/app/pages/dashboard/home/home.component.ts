import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OkxTicketService } from '@app/services/okx-tickets.service';
import { IOkxTicker } from '@app/type/ticket';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  tickers: IOkxTicker[] = [];
  private subscription: Subscription | null = null;

  headerTable = [
    { label: 'Mã' },
    { label: 'Trần' },
    { label: 'Sàn' },
    { label: 'Thị trường' },
    { label: 'Thấp nhất 24h' },
    { label: 'Khối lượng 24h' },
  ];

  // Các cặp tiền tệ mặc định cần theo dõi
  watchedInstruments: string[] = [
    'BTC-USDT',
    'ETH-USDT',
    'SOL-USDT',
    'XRP-USDT',
  ];

  // Cặp tiền tệ mới để thêm vào danh sách theo dõi
  newInstrument: string = '';

  constructor(private okxService: OkxTicketService) {}

  ngOnInit(): void {
    // Kết nối WebSocket khi component được khởi tạo
    this.okxService.connect(this.watchedInstruments);

    // Đăng ký kênh tickers với các cặp tiền tệ đã chọn
    // this.okxService.subscribe(this.watchedInstruments);

    // Đăng ký nhận dữ liệu tickers
    this.subscription = this.okxService.tickers$.subscribe((data) => {
      this.tickers = data;
    });
  }

  /**
   * Thêm một cặp tiền tệ mới vào danh sách theo dõi
   */
  addInstrument(): void {
    if (
      !this.newInstrument ||
      this.watchedInstruments.includes(this.newInstrument)
    ) {
      return;
    }

    this.watchedInstruments.push(this.newInstrument);
    this.okxService.subscribe([this.newInstrument]);
    this.newInstrument = '';
  }

  /**
   * Tính phần trăm thay đổi giá so với giá mở cửa
   */
  getPriceChangePercent(ticker: IOkxTicker): number {
    const lastPrice = parseFloat(ticker.last);
    const openPrice = parseFloat(ticker.open24h);
    return openPrice > 0 ? ((lastPrice - openPrice) / openPrice) * 100 : 0;
  }

  /**
   * Giải phóng tài nguyên khi component bị hủy
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.okxService.disconnect();
  }
}
