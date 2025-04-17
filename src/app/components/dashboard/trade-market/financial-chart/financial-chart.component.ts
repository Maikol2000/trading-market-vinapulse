import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandlestickService } from '@app/core/services';
import { IdIndicator, subscribeChannelsCandleType } from '@app/shared/models';
import { TranslateModule } from '@ngx-translate/core';

import {
  CandlestickData,
  CandlestickSeries,
  ChartOptions,
  createChart,
  CrosshairMode,
  DeepPartial,
  HistogramData,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  LineSeries,
  Time,
} from 'lightweight-charts';
import { Subscription } from 'rxjs';
import { IndicatorsSelectorComponent } from './indicators-selector/indicators-selector.component';
import { TimeframeSelectorComponent } from './timeframe-selector/timeframe-selector.component';
import { LegendIndicatorComponent } from './legend-indicator/legend-indicator.component';

@Component({
  selector: 'app-financial-chart',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TimeframeSelectorComponent,
    IndicatorsSelectorComponent,
    LegendIndicatorComponent,
  ],
  templateUrl: './financial-chart.component.html',
  styleUrl: './financial-chart.component.scss',
})
export class FinancialChartComponent {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  public symbol = signal<string>('');
  public selectedTimeframe = signal<subscribeChannelsCandleType>('1m');
  legendIndicator = signal<CandlestickData[]>([
    {
      time: '',
      open: 0,
      high: 0,
      low: 0,
      close: 0,
    },
  ]);

  // API Chart
  private chart: IChartApi | null = null;
  private candleSeries: ISeriesApi<'Candlestick'> | null = null;
  private volumeSeries: ISeriesApi<'Histogram'> | null = null;
  private bbSeries: {
    middle: ISeriesApi<'Line'>;
    upper: ISeriesApi<'Line'>;
    lower: ISeriesApi<'Line'>;
  } | null = null;
  private smaLine: ISeriesApi<'Line'> | null = null;

  private subscription: Subscription | null = null;

  constructor(
    private candlestickService: CandlestickService,
    private router: Router
  ) {
    const path = this.router.url.split('/');
    this.symbol.set(path[path.length - 1]);

    effect(() => {
      if (this.selectedTimeframe() && this.symbol()) {
        this.getHistoryCandles(this.selectedTimeframe());
        this.candlestickService.setSubcribe(
          this.symbol(),
          this.selectedTimeframe()
        );
        this.candlestickService.connectWebSocket();
        this.candlestickService.setTimer(500);
      }
    });
  }

  ngOnInit(): void {
    this.initChart();
    this.subscribeDefaultSeries();
    this.subIndChartCrosshairMove();
  }

  changeTimeframe(timeframe: subscribeChannelsCandleType) {
    this.selectedTimeframe.set(timeframe);
    // Reload chart data with new timeframe
    this.getHistoryCandles(timeframe);
  }

  // get initial data
  getHistoryCandles(
    timeframe: subscribeChannelsCandleType = '1H',
    limit: number = 100
  ) {
    this.candlestickService
      .getHistoryMarkets(this.symbol(), timeframe, limit)
      .subscribe((data) => {
        if (this.candleSeries && this.volumeSeries && data.candles.length > 0) {
          this.candleSeries.setData(data.candles);
          this.volumeSeries.setData(data.volumes);
        }
      });
  }

  private subscribeDefaultSeries() {
    this.subscription = this.candlestickService.serries$.subscribe((data) => {
      if (data && this.candleSeries && this.volumeSeries) {
        const serCandle = this.candleSeries.data();
        const serVolume = this.volumeSeries.data();
        if (serCandle && serVolume) {
          const existingIndexCandle = serCandle
            ? serCandle.findIndex(
                (item) =>
                  Number(item.time) === Number(data.candles?.time ?? '0')
              )
            : [];

          const existingIndexVolume = serVolume
            ? serVolume.findIndex(
                (item) =>
                  Number(item.time) === Number(data.volumes?.time ?? '0')
              )
            : [];

          // Set Candle
          if (
            typeof existingIndexCandle === 'number' &&
            existingIndexCandle !== -1
          ) {
            // Update existing candle
            const updatedSeries = [...serCandle];
            updatedSeries[existingIndexCandle] =
              data.candles as CandlestickData<Time>;
            this.candleSeries.setData(updatedSeries);
          } else {
            // Add new candle
            if (data.candles?.time)
              this.candleSeries.update(data.candles as CandlestickData<Time>);
          }

          // Set Volume
          if (
            typeof existingIndexVolume === 'number' &&
            existingIndexVolume !== -1
          ) {
            // Update existing candle
            const updatedSeries = [...serVolume];
            updatedSeries[existingIndexVolume] =
              data.volumes as HistogramData<Time>;
            this.volumeSeries.setData(updatedSeries);
          } else {
            // Add new volume
            if (data.volumes?.time)
              this.volumeSeries.update(data.volumes as HistogramData<Time>);
          }
        }
        this.subscribeIndicator();
      }
    });
  }

  private subscribeIndicator() {
    if (this.candleSeries?.data()) {
      const candleData = this.candleSeries.data() as CandlestickData[];

      // Update SMA if active
      if (this.smaLine) {
        const maData = this.calculateMA(candleData);
        this.smaLine.setData(maData);
      }

      // Update Bollinger Bands if active
      if (this.bbSeries) {
        const bbData = this.calculateBB(candleData, 20, 2);
        this.bbSeries.middle.setData(bbData.middle);
        this.bbSeries.upper.setData(bbData.upper);
        this.bbSeries.lower.setData(bbData.lower);
      }
    }
  }

  private subIndChartCrosshairMove() {
    if (this.chart && this.candleSeries) {
      this.chart.subscribeCrosshairMove((param) => {
        if (param.time && this.candleSeries) {
          const data = param.seriesData.get(this.candleSeries);
          if (data) {
            this.legendIndicator.set([data] as unknown as CandlestickData[]);
          }
        }
      });
    }
  }

  private initChart(): void {
    const container = this.chartContainer.nativeElement;
    const options: DeepPartial<ChartOptions> = {
      width: container.width,
      height: container.height,
      layout: {
        background: {
          color: '#0f0f0f',
        },
        textColor: '#d1d4dc',
        attributionLogo: false,
      },
      grid: {
        vertLines: {
          color: '#1f2937',
          visible: true,
        },
        horzLines: { color: '#1f2937' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
      timeScale: {
        borderColor: '#374151',
      },
    };

    this.chart = createChart(container, options);

    // Add candlestick series
    this.candleSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Create volume series with 70% of the main chart's height
    this.volumeSeries = this.chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });

    // Set up the price scale for volume
    this.chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
      autoScale: true,
    });

    // Enable kinetic scrolling
    this.chart.timeScale().applyOptions({
      timeVisible: true,
      secondsVisible: false,
      shiftVisibleRangeOnNewBar: true,
      barSpacing: 14.5,
    });
  }

  onSelectIndicator(ind: IdIndicator) {
    switch (ind) {
      case 'sma':
        this.addSimpleMovingAverage();
        break;
    }
  }

  private addSimpleMovingAverage() {
    if (!this.smaLine && this.chart) {
      this.smaLine = this.chart.addSeries(LineSeries, {
        color: '#2962FF',
        lineWidth: 2,
      });

      if (this.candleSeries && this.candleSeries?.data()) {
        // Tính toán MA và set data

        const candleData = this.candleSeries.data() as CandlestickData[];
        const maData = this.calculateMA(candleData);
        this.smaLine?.setData(maData);
      }
    }
  }

  private calculateMA(data: CandlestickData[], period: number = 4) {
    // Logic tính MA ở đây
    return data
      .map((candle, index) => {
        if (index < period - 1) return null;

        const sum = data
          .slice(index - period + 1, index + 1)
          .reduce((acc, curr) => acc + curr.close, 0);

        return {
          time: candle.time,
          value: sum / period,
        };
      })
      .filter((item) => item !== null);
  }

  private addBollingerBands(candleData: CandlestickData[]) {
    if (!this.bbSeries && this.chart) {
      // Create three line series for BB
      this.bbSeries = {
        middle: this.chart.addSeries(LineSeries, {
          color: '#2962FF',
          lineWidth: 2,
          title: 'BB Middle',
        }),
        upper: this.chart.addSeries(LineSeries, {
          color: 'rgba(41, 98, 255, 0.3)',
          lineWidth: 2,
          title: 'BB Upper',
        }),
        lower: this.chart.addSeries(LineSeries, {
          color: 'rgba(41, 98, 255, 0.3)',
          lineWidth: 2,
          title: 'BB Lower',
        }),
      };

      // Calculate BB data
      const bbData = this.calculateBB(candleData, 20, 2);

      // Set data for each line
      this.bbSeries.middle.setData(bbData.middle);
      this.bbSeries.upper.setData(bbData.upper);
      this.bbSeries.lower.setData(bbData.lower);
    }
  }

  private removeBollingerBands() {
    if (this.bbSeries && this.chart) {
      this.chart.removeSeries(this.bbSeries.middle);
      this.chart.removeSeries(this.bbSeries.upper);
      this.chart.removeSeries(this.bbSeries.lower);
      this.bbSeries = null;
    }
  }

  private calculateBB(
    data: CandlestickData[],
    period: number,
    multiplier: number
  ) {
    const bbData = data
      .map((candle, index) => {
        if (index < period - 1) return null;

        // Calculate SMA
        const slice = data.slice(index - period + 1, index + 1);
        const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
        const sma = sum / period;

        // Calculate Standard Deviation
        const squaredDiffs = slice.map((bar) => Math.pow(bar.close - sma, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / period;
        const standardDeviation = Math.sqrt(avgSquaredDiff);

        // Calculate BB values
        return {
          time: candle.time,
          middle: sma,
          upper: sma + standardDeviation * multiplier,
          lower: sma - standardDeviation * multiplier,
        };
      })
      .filter((item) => item !== null);

    // Separate data for each band
    return {
      middle: bbData.map((d) => ({ time: d!.time, value: d!.middle })),
      upper: bbData.map((d) => ({ time: d!.time, value: d!.upper })),
      lower: bbData.map((d) => ({ time: d!.time, value: d!.lower })),
    };
  }

  ngOnDestroy(): void {
    this.candlestickService.clearTimer();
    this.subscription?.unsubscribe();

    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }
  }
}
