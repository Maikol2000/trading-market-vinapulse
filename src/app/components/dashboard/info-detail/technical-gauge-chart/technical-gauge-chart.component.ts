import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LanguageService } from '@app/shared/services';
import { TranslateModule } from '@ngx-translate/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-technical-gauge-chart',
  imports: [HighchartsChartModule, CommonModule, TranslateModule],
  templateUrl: './technical-gauge-chart.component.html',
  styleUrl: './technical-gauge-chart.component.scss',
})
export class TechnicalGaugeChartComponent {
  // highcharts: typeof Highcharts = Highcharts;
  // chartOptions: Highcharts.Options = {};

  signalCount = { sell: 0, neutral: 0, buy: 0 };
  indicators = [
    { name: 'SMA', signal: 'Mua' },
    { name: 'RSI', signal: 'Mua' },
    { name: 'MACD', signal: 'Mua' },
    { name: 'LMN (GPT)', signal: 'Chung lập' },
    { name: 'LSTM', signal: 'Mua' },
  ];

  constructor(private translate: LanguageService) {}

  ngOnInit() {
    // this.initRealtimePriceStream();
    this.updateChart(65); // initial percent (e.g. 65% Buy)
  }

  updateChart(percent: number) {
    // this.chartOptions = {
    //   chart: {
    //     type: 'solidgauge',
    //     height: '110%',
    //   },
    //   title: { text: 'Summary' },
    //   pane: {
    //     center: ['50%', '70%'],
    //     size: '100%',
    //     startAngle: -90,
    //     endAngle: 90,
    //     background: [
    //       {
    //         backgroundColor: '#EEE',
    //         innerRadius: '60%',
    //         outerRadius: '100%',
    //         shape: 'arc',
    //       },
    //     ],
    //   },
    //   tooltip: { enabled: true },
    //   yAxis: {
    //     min: 0,
    //     max: 100,
    //     stops: [
    //       [0.2, '#f44336'],
    //       [0.5, '#9c27b0'],
    //       [0.8, '#4caf50'],
    //     ],
    //     lineWidth: 0,
    //     tickWidth: 0,
    //     minorTickInterval: 100,
    //     tickAmount: 2,
    //     labels: { enabled: false },
    //   },
    //   plotOptions: {
    //     solidgauge: {
    //       dataLabels: {
    //         y: -20,
    //         borderWidth: 0,
    //         useHTML: true,
    //         format:
    //           '<div style="text-align:center"><span style="font-size:1.5rem">Buy</span></div>',
    //       },
    //     },
    //   },
    //   series: [
    //     {
    //       type: 'solidgauge',
    //       name: 'Buy strength',
    //       data: [percent],
    //     },
    //   ],
    // };
  }

  // TODO: Implement this function to fetch real-time price data and calculate SMA/RSI/MACD
  initRealtimePriceStream() {
    const socket = webSocket('wss://ws.okx.com:8443/ws/v5/public');
    socket.next({
      op: 'subscribe',
      args: [
        {
          channel: 'candle1m',
          instId: 'BTC-USDT',
        },
      ],
    });

    socket.subscribe((msg: any) => {
      console.log('msg', msg);
      const close = parseFloat(msg.data[0][4]);
      console.log('Realtime Close Price:', close);
      // TODO: Push to price array, calculate SMA/RSI/MACD, and update signalCount + chart
    });
  }
}
