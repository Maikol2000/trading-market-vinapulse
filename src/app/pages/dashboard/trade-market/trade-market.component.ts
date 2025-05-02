import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { OrderFormComponent } from '@app/components/dashboard/order';
import {
  FinancialChartComponent,
  WathclistTicketComponent,
} from '@app/components/dashboard/trade-market';
import { IOKXTicker } from '@app/core/models';
import { OKXCurrencyService } from '@app/core/services';
import { LoadingComponent } from '@app/shared/components';
import { LoadingService } from '@app/shared/services';
import { debounceTime, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-trade-market',
  imports: [
    FinancialChartComponent,
    OrderFormComponent,
    WathclistTicketComponent,
    LoadingComponent,
    CommonModule,
  ],
  templateUrl: './trade-market.component.html',
  styleUrl: './trade-market.component.scss',
})
export class TradeMarketComponent {
  watchlist = ['BTC-USDT', 'ETH-USDT', 'XRP-USDT', 'LTC-USDT', 'BCH-USDT'];
  subscription: Subscription | null = null;

  tickets = signal<IOKXTicker[]>([]);

  loading = signal(true);

  constructor(
    private tickerService: OKXCurrencyService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.getTickerSubscribe();
    this.loadingService.loading$.subscribe((l) => {
      this.loading.set(l);
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(
        tap((event) => {
          if (event instanceof NavigationStart) {
            this.loadingService.loadingOn();
          } else if (event instanceof NavigationEnd) {
            setTimeout(() => {
              this.loadingService.loadingOff();
            }, 200);
          }
        })
      )
      .subscribe();

    this.subscription = this.tickerService.currencies$
      .pipe(debounceTime(100))
      .subscribe((data) => {
        this.tickets.set(data);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.tickerService.disconnect();
  }

  getTickerSubscribe() {
    this.tickerService.connect(this.watchlist);
  }
}
