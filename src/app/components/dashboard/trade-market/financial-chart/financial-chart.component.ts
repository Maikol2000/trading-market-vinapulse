import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandlestickService } from '@app/core/services';
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

@Component({
  selector: 'app-financial-chart',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './financial-chart.component.html',
  styleUrl: './financial-chart.component.scss',
})
export class FinancialChartComponent {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  private chart: IChartApi | null = null;

  candleData: CandlestickData[] = [];
  volumeData: HistogramData[] = [];

  public symbol = signal<string>('BTC-USDT');

  private subscription: Subscription | null = null;
  private candleSeries: ISeriesApi<'Candlestick'> | null = null;
  private volumeSeries: ISeriesApi<'Histogram'> | null = null;

  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private candlestickService: CandlestickService,
    private router: Router
  ) {
    this.getHistoryCandles();
  }

  ngOnInit(): void {
    this.initChart();
    this.setupResizeObserver();
    const path = this.router.url.split('/');
    this.symbol.set(path[path.length - 1]);

    this.candlestickService.connectWebSocket(this.symbol(), 'candle1m');
    this.candlestickService.setTimer(500);

    this.subscription = this.candlestickService.series$.subscribe((data) => {
      if (data && this.candleSeries) {
        const ser = this.candleSeries.data();
        if (ser) {
          const existingIndex = ser
            ? ser.findIndex((item) => Number(item.time) === Number(data.time))
            : [];

          if (typeof existingIndex === 'number' && existingIndex !== -1) {
            // Update existing candle
            const updatedSeries = [...ser];
            updatedSeries[existingIndex] = data as CandlestickData<Time>;
            this.candleSeries.setData(updatedSeries);
          } else {
            // Add new candle
            if (data.time)
              this.candleSeries.update(data as CandlestickData<Time>);
          }
        }
      }
    });
  }

  getHistoryCandles() {
    this.candlestickService
      .getHistoryMarkets(this.symbol())
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
          color: '#131722',
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

  private setupResizeObserver(): void {
    const container = this.chartContainer.nativeElement;

    this.resizeObserver = new ResizeObserver(() => {
      if (this.chart) {
        const { width, height } = container.getBoundingClientRect();
        this.chart.resize(width, height);
      }
    });

    this.resizeObserver.observe(container);
  }

  ngOnDestroy(): void {
    this.candlestickService.clearTimer();
    this.subscription?.unsubscribe();

    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
