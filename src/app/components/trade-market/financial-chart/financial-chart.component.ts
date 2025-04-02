import { CommonModule } from '@angular/common';
import { Component, effect, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ICandleData } from '@app/core/models/candle';
import { CandlestickService } from '@app/core/services';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-financial-chart',
  imports: [CommonModule, NgApexchartsModule, ReactiveFormsModule],
  templateUrl: './financial-chart.component.html',
  styleUrl: './financial-chart.component.scss',
})
export class FinancialChartComponent {
  @ViewChild('chart', { static: false }) chart!: ChartComponent;
  public chartOptions: Partial<{
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
    series: ApexAxisChartSeries;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    stroke: {
      show: boolean;
      width: number;
    };
  }> = {
    series: [
      {
        name: 'Candle Data',
        data: [],
      },
    ],
    chart: {
      type: 'candlestick',
      height: 400,
      toolbar: {
        autoSelected: 'pan',
        show: false,
      },
      zoom: {
        autoScaleYaxis: false,
      },
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      enabled: true,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
    },
  };

  public series = signal<ICandleData[]>([]);

  private subscription: Subscription | null = null;

  constructor(private candlestickService: CandlestickService) {
    this.getHistoryCandles();
    effect(() => {
      if (this.series().length > 0) {
        this.chart.updateSeries([{ data: this.series() }]);
      }
    });
  }

  ngOnInit(): void {
    this.candlestickService.connectWebSocket();
    this.candlestickService.setTimer(500);

    this.subscription = this.candlestickService.series$.subscribe((data) => {
      if (data.x) {
        const ser = this.series();
        const existingIndex = ser.findIndex(
          (item) => new Date(item.x).getTime() === new Date(data?.x!).getTime()
        );

        if (existingIndex !== -1) {
          // Update existing candle
          const updatedSeries = [...ser];
          updatedSeries[existingIndex] = data as ICandleData;
          this.series.set(updatedSeries);
        } else {
          // Add new candle
          this.series.update((s) => [...s, data as ICandleData]);
        }
      }
    });
  }

  getHistoryCandles() {
    this.candlestickService.getHistoryCandles('BTC-USDT').subscribe((data) => {
      this.series.update((s) => [...s, ...(data ?? [])]);
    });
  }

  ngOnDestroy(): void {
    this.candlestickService.clearTimer();
    this.subscription?.unsubscribe();
  }
}
