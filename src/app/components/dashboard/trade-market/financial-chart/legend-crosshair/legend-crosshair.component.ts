import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { BollingerBands } from '@app/shared/models/bolliner-band';
import { LineData } from 'lightweight-charts';

@Component({
  selector: 'app-legend-crosshair',
  imports: [CommonModule],
  templateUrl: './legend-crosshair.component.html',
  styleUrl: './legend-crosshair.component.scss',
})
export class LegendCrosshairComponent {
  // Input signals
  smaData = input<LineData>();
  bbData = input<Partial<BollingerBands>>();
  period = input<number>(9);

  // Output events
  @Output() onToggleSMA = new EventEmitter<void>();
}
