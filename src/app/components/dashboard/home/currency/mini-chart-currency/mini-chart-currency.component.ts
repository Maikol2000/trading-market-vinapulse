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

  vol = signal<LineData<Time>[]>([]);
  isPriceUp = signal<boolean>(true);

  constructor(private candleService: CandlestickService) {
    effect(() => {
      if (this.symbol()) {
        this.getCandlestick();
      }
    });
  }

  getCandlestick() {
    this.candleService.getHistoryMarkets(this.symbol(), "1D", 100).subscribe((resp) => {
      this.vol.set(
        resp.volumes.map((v) => ({
          value: v.value,
          // color: v.color,
          time: v.time,
        }))
      );
      this.isPriceUp.set(
        resp.volumes[resp.volumes.length - 1].value > resp.volumes[0].value
      );
    });
  }
}
