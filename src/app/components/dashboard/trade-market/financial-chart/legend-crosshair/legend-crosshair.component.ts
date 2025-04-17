import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { IdIndicator, IndicatorVisibility } from '@app/shared/models';
import { BollingerBands } from '@app/shared/models/bolliner-band';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LineData } from 'lightweight-charts';

@Component({
  selector: 'app-legend-crosshair',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './legend-crosshair.component.html',
  styleUrl: './legend-crosshair.component.scss',
})
export class LegendCrosshairComponent {
  // Input signals
  smaData = input<Partial<LineData>>();
  bbData = input<Partial<BollingerBands>>();
  isSMAVisible = input<boolean>(true);
  isBBVisible = input<boolean>(true);

  // Output events
  @Output() onToggleSMA = new EventEmitter<void>();
  @Output() onToggleVisibility = new EventEmitter<IndicatorVisibility>();
  @Output() onRemove = new EventEmitter<IdIndicator>();

  // icon
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  trash = faTrash;
}
