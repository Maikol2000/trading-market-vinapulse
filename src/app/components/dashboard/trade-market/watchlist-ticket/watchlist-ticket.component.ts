import { CommonModule, NgClass } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CandlestickService } from '@app/core/services';
import { MiniChartComponent } from '@app/shared/components';
import { AppRouter } from '@app/utils/routers';
import { LineData, Time } from 'lightweight-charts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-watchlist-ticket',
  imports: [CommonModule, MiniChartComponent, NgClass],
  templateUrl: './watchlist-ticket.component.html',
})
export class WatchlistTicketComponent implements OnInit, OnDestroy {
  watchTicket = input<string>('');
  price = input('0');
  open24h = input('0');

  percentChange = computed(
    () => ((+this.price() - +this.open24h()) / +this.open24h()) * 100
  );

  isSelected = computed(() => {
    return this.watchTicket() === this.symbol();
  });

  currenciesSignal = signal<LineData<Time>[]>([]);
  symbol = signal<string>('');

  private subscription: Subscription | null = null;
  click: any;

  constructor(
    private candleService: CandlestickService,
    private router: Router
  ) {
    this.setSymbol();

    effect(() => {
      if (this.watchTicket()) {
        this.getCandlestick();
      }
    });
  }

  ngOnInit() {
    // Subscribe to the router events to update the symbol when the route changes
    this.router.events.subscribe(() => {
      this.setSymbol();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.candleService.disconnect();
  }

  setSymbol() {
    const path = this.router.url.split('/');
    this.symbol.set(path[path.length - 1]);
  }

  getCandlestick() {
    this.candleService
      .getHistoryMarkets(this.watchTicket(), '1D', 300)
      .subscribe(({ candles }) => {
        this.currenciesSignal.set(
          candles.map((v) => ({
            value: v.close,
            time: v.time,
          }))
        );
      });
  }

  redirectToDetail(): void {
    this.router.navigate([AppRouter.Dashboard.TradeMarket(this.watchTicket())]);
    this.setSymbol();
  }
}
