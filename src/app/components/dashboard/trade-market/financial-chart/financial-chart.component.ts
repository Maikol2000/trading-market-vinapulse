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
import { ICandleData } from '@app/core/models/candle';
import { CandlestickService } from '@app/core/services';
import { TranslateModule } from '@ngx-translate/core';

import {
  CandlestickData,
  CandlestickSeries,
  ChartOptions,
  ColorType,
  createChart,
  CrosshairMode,
  HistogramData,
  HistogramSeries,
  IChartApi,
  IRange,
  ISeriesApi,
  PriceScaleMode,
  Time,
} from 'lightweight-charts';
import { Subscription } from 'rxjs';
import { TraddingVolumeComponent } from './tradding-volume/tradding-volume.component';
import { Options } from 'highcharts';

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

  constructor(
    private candlestickService: CandlestickService,
    private router: Router
  ) {
    this.getHistoryCandles();
  }

  ngOnInit(): void {
    this.initChart();
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
      .getHistoryCandles(this.symbol())
      .subscribe((data) => {
        if (this.candleSeries && data.length > 0) {
          const sortedData = data.sort(
            (a, b) => Number(a.time) - Number(b.time)
          );
          this.candleSeries.setData(sortedData);
        }
      });
  }

  private initChart(): void {
    const container = this.chartContainer.nativeElement;
    const options: any = {
      width: container.width,
      height: container.height,
      layout: {
        background: '#131722',
        textColor: '#d1d4dc',
        attributionLogo: false,
      },
      grid: {
        vertLines: '#1f2937',
        horzLines: '#1f2937',
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
  }
}
