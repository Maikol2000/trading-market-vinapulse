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
import { subscribeChannelsCandleType } from '@app/shared/models';
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
  Time,
} from 'lightweight-charts';
import { Subscription } from 'rxjs';
import { TimeframeSelectorComponent } from './timeframe-selector/timeframe-selector.component';

@Component({
  selector: 'app-financial-chart',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TimeframeSelectorComponent,
  ],
  templateUrl: './financial-chart.component.html',
  styleUrl: './financial-chart.component.scss',
})
export class FinancialChartComponent {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  private chart: IChartApi | null = null;

  candleData: CandlestickData[] = [];
  volumeData: HistogramData[] = [];

  public symbol = signal<string>('');
  public selectedTimeframe = signal<subscribeChannelsCandleType>('1m');

  private subscription: Subscription | null = null;
  private candleSeries: ISeriesApi<'Candlestick'> | null = null;
  private volumeSeries: ISeriesApi<'Histogram'> | null = null;

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
      }
    });
  }

  changeTimeframe(timeframe: subscribeChannelsCandleType) {
    this.selectedTimeframe.set(timeframe);
    // Reload chart data with new timeframe
    this.getHistoryCandles(timeframe);
  }

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
      // scaleMargins: {
      //   top: 0.8,
      //   bottom: 0,
      // },
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
    });
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
