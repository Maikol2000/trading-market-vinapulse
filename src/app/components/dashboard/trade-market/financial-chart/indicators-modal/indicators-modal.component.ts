import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@app/shared/components';
import { IdIndicator, Indicator } from '@app/shared/models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartLine,
  faSearch,
  faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, map, startWith } from 'rxjs';

@Component({
  selector: 'app-indicators-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    TranslateModule,
    FontAwesomeModule,
  ],
  templateUrl: './indicators-modal.component.html',
  styleUrl: './indicators-modal.component.scss',
})
export class IndicatorsModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<IdIndicator>();

  faSearch = faSearch;
  searchControl = new FormControl('');

  indicators: Indicator[] = [
    {
      id: 'sma',
      name: 'Simple Moving Average (SMA)',
      description: 'Shows the average price over a specific period',
      icon: faChartLine,
      isActive: false,
      type: 'trend',
    },
    {
      id: 'bb',
      name: 'Bollinger Bands (BB)',
      description: '',
      icon: faWaveSquare,
      isActive: false,
      type: 'momentum',
    },
  ];

  filteredIndicators = signal<Indicator[]>([]);

  selectIndicator: Indicator[] = [];

  ngOnInit() {
    const vr = combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
    ]).pipe(map(([searchTerm]) => this.filterIndicators(searchTerm || '')));

    vr.subscribe((ind) => {
      this.filteredIndicators.set(ind);
    });
  }

  private filterIndicators(searchTerm: string): Indicator[] {
    const term = searchTerm.toLowerCase();
    return this.indicators.filter(
      (indicator) =>
        indicator.name.toLowerCase().includes(term) ||
        indicator.description.toLowerCase().includes(term)
    );
  }

  onSelect(selec: IdIndicator) {
    this.select.emit(selec);
  }

  onClose() {
    this.close.emit();
  }
}
