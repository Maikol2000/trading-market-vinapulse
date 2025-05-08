import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

import { IOrderBook } from '@app/core/models';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { OrderBookWSService } from '@app/core/services';
import { LanguageService } from '@app/shared/services';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-order-book',
  imports: [CommonModule, TranslateModule],
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss'],
})
export class OrderBookComponent implements OnInit {
  public orderBook: IOrderBook | null = null;
  public chartOptions: Partial<any> | null = null;

  private destroy$ = new Subject<void>();

  public symbol = signal<string>('BTC-USDT');

  constructor(
    private orderBookService: OrderBookWSService,
    private router: Router,
    private translate: LanguageService
  ) {}

  ngOnInit(): void {
    const path = this.router.url.split('/');
    const sub = path[path.length - 1];
    this.symbol.set(sub.split('-').join('/'));

    this.orderBookService.orderBook$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.orderBook = data;
          this.updateChart();
        }
      });

    this.orderBookService.startStreaming(sub);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.orderBookService.stopStreaming();
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
          name: this.translate.getInstantLang('TRADE.ORDER_BOOK.BIDS'),
          type: 'bar',
          data: bidSizes,
        },
        {
          name: this.translate.getInstantLang('TRADE.ORDER_BOOK.ASKS'),
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
          text: this.translate.getInstantLang('TRADE.ORDER_BOOK.SIZE'),
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
        text: this.translate.getInstantLang('TRADE.ORDER_BOOK.DEPTH_CHART'),
        align: 'center',
        style: {
          color: '#F9FAFB',
        },
      },
    };
  }
}
