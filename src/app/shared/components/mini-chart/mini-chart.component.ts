import { Component, ElementRef, ViewChild, effect, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ChartOptions,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LineData,
  LineSeries,
  LineStyleOptions,
  SeriesOptionsCommon,
  Time,
  createChart,
} from 'lightweight-charts';

@Component({
  selector: 'app-mini-chart',
  imports: [TranslateModule],
  templateUrl: './mini-chart.component.html',
  styleUrl: './mini-chart.component.scss',
})
export class MiniChartComponent {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  chartData = input<LineData<Time>[]>([]);
  colorTrend = input<boolean>(true);

  private chart?: IChartApi;
  private lineSeries?: ISeriesApi<'Line'>;

  constructor() {
    effect(() => {
      if (this.lineSeries && this.chartData()) {
        this.lineSeries.setData(this.chartData());
        this.updateChartColor();
      }
    });
  }

  ngOnInit(): void {
    this.initChart();
  }

  private initChart(): void {
    if (!this.chartContainer) return;

    const options: DeepPartial<ChartOptions> = {
      width: 100,
      height: 50,
      layout: {
        background: { color: 'transparent' },
        textColor: 'transparent',
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false },
      },
      rightPriceScale: { visible: false },
      timeScale: {
        visible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: false,
      handleScale: false,
    };

    this.chart = createChart(this.chartContainer.nativeElement, options);

    const lineOptions: DeepPartial<LineStyleOptions & SeriesOptionsCommon> = {
      color: this.colorTrend() ? '#22c55e' : '#ef4444',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    };

    this.lineSeries = this.chart.addSeries(LineSeries, lineOptions);

    // Initial data setup
    if (this.chartData()) {
      this.lineSeries.setData(this.chartData());
    }

    // Fit content
    this.chart.timeScale().fitContent();
  }

  private updateChartColor(): void {
    if (this.lineSeries) {
      this.lineSeries.applyOptions({
        color: this.colorTrend() ? '#22c55e' : '#ef4444',
      });
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.remove();
    }
  }
}
