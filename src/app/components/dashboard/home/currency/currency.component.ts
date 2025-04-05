import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ICurrencyData } from '@app/core/models';
import { OKXCurrencyService } from '@app/core/services';
import { AppRouter } from '@app/utils/routers';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-currency',
  imports: [CommonModule],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss',
})
export class CurrencyComponent {
  currenciesSignal = signal<ICurrencyData[]>([]);
  isLoading = true;
  error: string | null = null;
  private subscription: Subscription | null = null;

  setTimer = false;

  watchedInstruments: string[] = [
    'BTC-USDT',
    'ETH-USDT',
    'XRP-USDT',
    'LTC-USDT',
    'BCH-USDT',
    'SOL-USDT',
    'ADA-USDT',
    'DOT-USDT',
    'AVAX-USDT',
    'DOGE-USDT',
    'TRX-USDT',
    'LINK-USDT',
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
        this.setTimer = true;
        this.currenciesSignal.set(data);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      console.log('Unsubscribing from currency data...');
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
