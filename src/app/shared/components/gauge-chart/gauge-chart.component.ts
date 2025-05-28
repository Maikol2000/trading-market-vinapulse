import {
  Component,
  computed,
  effect,
  input,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';

interface GaugeConfig {
  min: number;
  max: number;
}

@Component({
  selector: 'app-gauge-chart',
  imports: [],
  templateUrl: './gauge-chart.component.html',
  styleUrl: './gauge-chart.component.scss',
})
export class GaugeChartComponent {
  value = input(0);

  rotation = signal(0);

  indicatorTransform = computed(
    () => `translate(0,0) rotate(${this.rotation()}, 152, 191)`
  );

  gaugeConfig = {
    min: 0,
    max: 100,
  };

  constructor() {
    effect(() => {
      if (this.value()) this.calculateRotation();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
    }
  }

  private calculateRotation(): void {
    this.rotation.set(this.value() + 18);
  }
}
