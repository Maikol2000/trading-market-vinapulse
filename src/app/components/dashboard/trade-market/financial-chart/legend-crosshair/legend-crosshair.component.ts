import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
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
  period = input<number>(9);

  // Output events
  @Output() onToggleSMA = new EventEmitter<void>();
}
