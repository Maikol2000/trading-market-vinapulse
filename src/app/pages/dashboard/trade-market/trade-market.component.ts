import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { OrderFormComponent } from '@app/components/dashboard/order';
import {
  FinancialChartComponent,
  OrderPortfolioComponent,
  TicketModalComponent,
  WatchlistTicketComponent,
} from '@app/components/dashboard/trade-market';
import { IOKXTicker } from '@app/core/models';
import { OKXCurrencyService } from '@app/core/services';
import { LoadingComponent } from '@app/shared/components';
import { LoadingService, ModalService } from '@app/shared/services';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-trade-market',
  imports: [
    FinancialChartComponent,
    OrderFormComponent,
    WatchlistTicketComponent,
    LoadingComponent,
    CommonModule,
    TranslateModule,
    OrderPortfolioComponent,
  ],
  templateUrl: './trade-market.component.html',
})
export class TradeMarketComponent {
  watchlist = ['ETH-USDT', 'XRP-USDT', 'LTC-USDT', 'BCH-USDT'];
  subscription: Subscription | null = null;

  tickets = signal<IOKXTicker[]>([]);

  loading = signal(true);

  constructor(
    private tickerService: OKXCurrencyService,
    private router: Router,
    private loadingService: LoadingService,
    private modalService: ModalService
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

  openModal() {
    const modalRef = this.modalService.open(TicketModalComponent);
    const instance = modalRef.instance;

    instance.selectInstrument.subscribe((instrument) => {
      this.tickerService.disconnect();
      this.watchlist.push(instrument.symbol);
      this.tickerService.connect(this.watchlist);
    });

    instance.close.subscribe(() => {
      this.modalService.close(modalRef);
    });
  }
}
