import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IOKXTicker } from '@app/core/models';
import { OKXCurrencyService } from '@app/core/services';
import { AppRouter } from '@app/utils/routers';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, Subscription } from 'rxjs';
import { MiniChartCurrencyComponent } from './mini-chart-currency/mini-chart-currency.component';

@Component({
  selector: 'app-currency',
  imports: [CommonModule, TranslateModule, MiniChartCurrencyComponent],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss',
})
export class CurrencyComponent {
  currenciesSignal = signal<IOKXTicker[]>([]);
  isLoading = true;
  error: string | null = null;
  private subscription: Subscription | null = null;

  watchedInstruments = [
    'BTC-USDT',
    'ETH-USDT',
    'XRP-USDT',
    'LTC-USDT',
    'BCH-USDT',
  ];

  constructor(
    private currencyService: OKXCurrencyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currencyService.connect(this.watchedInstruments);
    this.subscription = this.currencyService.currencies$
      .pipe(debounceTime(100))
      .subscribe((data) => {
        this.currenciesSignal.set(data);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.currencyService.disconnect();
  }

  // Định dạng số với dấu phân cách hàng nghìn
  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }).format(num);
  }

  redirectToDetail(instrument: string): void {
    this.router.navigate([AppRouter.Dashboard.TradeMarket(instrument)]);
  }
}
