import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ICandleData } from '@app/core/models/candle';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type VolumeChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-tradding-volume',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './tradding-volume.component.html',
  styleUrl: './tradding-volume.component.scss',
})
export class TraddingVolumeComponent implements OnChanges {
  @ViewChild('volumeChart') chart!: ChartComponent;
  @Input() series: ICandleData[] = [];

  public chartOptions: Partial<VolumeChartOptions> = {
    series: [
      {
        name: 'Volume',
        data: [],
      },
    ],
    chart: {
      type: 'bar',
      height: 200,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    fill: {
      opacity: 1,
      colors: ['#4ade80', '#f87171'],
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      labels: {
        formatter: (value) => this.formatVolume(value),
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series'] && this.series) {
      const volumeData = this.series.map((candle) => ({
        x: candle.x,
        y: candle.vol,
        fillColor:
          Number(candle.y[3]) >= Number(candle.y[0]) ? '#26a69a' : '#ef5350',
      }));

      this.chartOptions.series = [
        {
          name: 'Volume',
          data: volumeData,
        },
      ];
    }
  }

  private formatVolume(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }
}
