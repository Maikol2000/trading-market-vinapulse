import { Component, effect, input, signal } from '@angular/core';
import { CandlestickService } from '@app/core/services';
import { MiniChartComponent } from '@app/shared/components';
import { LineData, Time } from 'lightweight-charts';

@Component({
  selector: 'app-mini-chart-currency',
  imports: [MiniChartComponent],
  templateUrl: './mini-chart-currency.component.html',
  styleUrl: './mini-chart-currency.component.scss',
})
export class MiniChartCurrencyComponent {
  symbol = input<string>('');
  isPriceUp = input<boolean>(true);

  vol = signal<LineData<Time>[]>([]);

  constructor(private candleService: CandlestickService) {
    effect(() => {
      if (this.symbol()) {
        this.getCandlestick();
      }
    });
  }

  getCandlestick() {
    this.candleService
      .getHistoryMarkets(this.symbol(), '1D', 300)
      .subscribe(({ candles }) => {
        this.vol.set(
          candles.map((v) => ({
            value: v.close,
            time: v.time,
          }))
        );
      });
  }
}
