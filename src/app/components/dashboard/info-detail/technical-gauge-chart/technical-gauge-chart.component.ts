import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { CandlestickService } from '@app/core/services';
import { LanguageService } from '@app/shared/services';
import { TranslateModule } from '@ngx-translate/core';
import { DxCircularGaugeModule, DxRangeSliderModule } from 'devextreme-angular';

type NgxThresholds = {
  [key in 0 | 30 | 70]: {
    color: string;
    label: string;
  };
};

@Component({
  selector: 'app-technical-gauge-chart',
  imports: [
    CommonModule,
    TranslateModule,
    DxCircularGaugeModule,
    DxRangeSliderModule,
  ],
  templateUrl: './technical-gauge-chart.component.html',
  styleUrl: './technical-gauge-chart.component.scss',
})
export class TechnicalGaugeChartComponent {
  gaugeValue = signal(80);
  gaugeLabel = signal('BUY');
  gaugeForegroundColor = signal('');
  gaugeAppendText = '%';
  gaugeThick = 40;
  gaugeSize = 400;
  customizeText = (arg: { value: number }) => {
    return `${arg.value}%`;
  };
  gaugeOptions = {
    scale: {
      startValue: 0,
      endValue: 100,
      tick: {
        color: '#9b9b9b',
      },
      label: {
        customizeText: this.customizeText,
      },
    },
    rangeContainer: {
      palette: 'pastel',
      ranges: [
        {
          startValue: 0,
          endValue: 30,
          color: '#DF5353',
        },
        {
          startValue: 30,
          endValue: 70,
          color: '#DDDF0D',
        },
        {
          startValue: 70,
          endValue: 100,
          color: '#55BF3B',
        },
      ],
    },
    title: {
      text: 'Technical Analysis',
      font: { size: 28 },
    },
    valueIndicator: {
      type: 'triangleNeedle',
      color: '#9b9b9b',
    },
    subvalues: [],
  };

  thresholds: NgxThresholds = {
    '0': {
      color: '#DF5353',
      label: 'SELL',
    }, // Red for Sell
    '30': { color: '#DDDF0D', label: 'NEUTRAL' }, // Yellow for Neutral
    '70': { color: '#55BF3B', label: 'BUY' }, // Green for Buy
  };

  indicators = [
    { name: 'SMA', signal: 'BUY' },
    { name: 'RSI', signal: 'BUY' },
    { name: 'MACD', signal: 'BUY' },
    { name: 'ML Prediction', signal: 'NEUTRAL' },
    { name: 'LSTM', signal: 'BUY' },
  ];

  symbol = 'BTC-USDT';

  closes: number[] = [];

  constructor(
    private service: CandlestickService,
    private langService: LanguageService
  ) {
    this.getHistoryCandle();
    this.service.setSubcribe(this.symbol, '1m');
    this.service.connectWebSocket();
    this.service.serries$.subscribe((resp) => {
      if (resp.candles) {
        const { close } = resp.candles;
        this.closes.push(close);
        const rsi = this.calculateRSI(this.closes.slice(-100));
        this.updateGauge(rsi);
        this.setThresholds();
      }
    });
  }

  ngOnInit() {}

  calculateRSI(closes: number[]): number {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= 100; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }

    const avgGain = gains / 100;
    const avgLoss = losses / 100;

    const rs = avgGain / (avgLoss || 1);
    const rsi = 100 - 100 / (1 + rs);
    return rsi;
  }

  updateGauge(value: number) {
    this.gaugeValue.set(value);
  }

  setThresholds() {
    this.thresholds['0'].label =
      this.langService.getInstantLang('COMMONS.SELL');
    this.thresholds['30'].label =
      this.langService.getInstantLang('COMMONS.NEUTRAL');
    this.thresholds['70'].label =
      this.langService.getInstantLang('COMMONS.BUY');
  }

  getHistoryCandle() {
    this.service.getHistoryMarkets(this.symbol, '1m').subscribe((resp) => {
      if (resp.candles) {
        const cls = resp.candles.map((c) => c.close);
        this.closes = cls;
        const rsi = this.calculateRSI(cls);
        this.updateGauge(rsi);
      }
    });
  }
}
