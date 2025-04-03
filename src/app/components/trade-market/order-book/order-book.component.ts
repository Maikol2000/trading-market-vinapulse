// order-book.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';

import { IOrderBook } from '@app/core/models';
import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { OrderBookService } from '@app/core/services/order-book.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  fill: ApexFill;
};

@Component({
  selector: 'app-order-book',
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss'],
})
export class OrderBookComponent implements OnInit {
  public orderBook: IOrderBook | null = null;
  public selectedSymbol = 'BTC-USDT';
  public chartOptions: Partial<ApexOptions> | null = null;

  private destroy$ = new Subject<void>();

  constructor(private orderBookService: OrderBookService) {}

  ngOnInit(): void {
    this.orderBookService.orderBook$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.orderBook = data;
          this.updateChart();
        }
      });

    this.orderBookService.startStreaming(this.selectedSymbol);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.orderBookService.stopStreaming();
  }

  changeSymbol(symbol: string): void {
    if (this.selectedSymbol !== symbol) {
      this.selectedSymbol = symbol;
      this.orderBookService.changeSymbol(symbol);
    }
  }

  private updateChart(): void {
    if (!this.orderBook) return;

    const bidPrices = this.orderBook.bids.map((b) => b.price);
    const askPrices = this.orderBook.asks.map((a) => a.price);
    const bidSizes = this.orderBook.bids.map((b) => b.size);
    const askSizes = this.orderBook.asks.map((a) => a.size);

    this.chartOptions = {
      series: [
        {
          name: 'Bids',
          type: 'bar',
          data: bidSizes,
        },
        {
          name: 'Asks',
          type: 'bar',
          data: askSizes,
        },
      ],
      chart: {
        type: 'bar',
        height: 250,
        stacked: false,
        toolbar: {
          show: false,
        },
        background: 'transparent',
      },
      colors: ['#10B981', '#EF4444'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [1, 1],
      },
      xaxis: {
        categories: [...bidPrices.reverse(), ...askPrices],
        labels: {
          rotate: -45,
          style: {
            colors: '#9CA3AF',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Size',
          style: {
            color: '#9CA3AF',
          },
        },
        labels: {
          style: {
            colors: '#9CA3AF',
          },
        },
      },
      title: {
        text: 'Order Book Depth',
        align: 'center',
        style: {
          color: '#F9FAFB',
        },
      },
    };
  }
}
