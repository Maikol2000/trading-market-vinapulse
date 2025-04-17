import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { CandlestickData } from 'lightweight-charts';

@Component({
  selector: 'app-legend-indicator',
  imports: [CommonModule],
  templateUrl: './legend-indicator.component.html',
  styleUrl: './legend-indicator.component.scss',
})
export class LegendIndicatorComponent {
  data = input<CandlestickData[]>([]);

  change = computed(() => {
    if (!this.data()?.length) return null;
    const currentCandle = this.data()[0];
    const change =
      ((currentCandle.close - currentCandle.open) / currentCandle.open) * 100;
    return change;
  });

  // Helper method to determine if candle is up or down
  isUpCandle(): boolean {
    if (!this.data()?.length) return false;
    return this.data()[0].close >= this.data()[0].open;
  }
}
