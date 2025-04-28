import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { IOKXTicker } from '@app/core/models';
import { OKXCurrencyService } from '@app/core/services';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-wathclist-ticket',
  imports: [CommonModule],
  templateUrl: './wathclist-ticket.component.html',
  styleUrl: './wathclist-ticket.component.scss',
})
export class WathclistTicketComponent implements OnInit, OnDestroy {
  currenciesSignal = signal<IOKXTicker[]>([]);
  private subscription: Subscription | null = null;

  watchlist = ['BTC-USDT', 'ETH-USDT', 'XRP-USDT', 'LTC-USDT', 'BCH-USDT'];

  constructor(private currencyService: OKXCurrencyService) {}

  ngOnInit() {
    this.currencyService.connect(this.watchlist);
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
}
