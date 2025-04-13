import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '@app/shared/directives';
import { subscribeChannelsCandleType, Timeframe } from '@app/shared/models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-timeframe-selector',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ClickOutsideDirective,
  ],
  templateUrl: './timeframe-selector.component.html',
  styleUrl: './timeframe-selector.component.scss',
})
export class TimeframeSelectorComponent {
  //output
  setTimeframe = output<subscribeChannelsCandleType>();

  isDropdownOpen = false;

  public selectedTimeframe: subscribeChannelsCandleType = '1m';

  public timeframes: Timeframe<subscribeChannelsCandleType>[] = [
    { value: '1m', label: 'TIMEFRAME.1m' },
    { value: '3m', label: 'TIMEFRAME.3m' },
    { value: '5m', label: 'TIMEFRAME.5m' },
    { value: '15m', label: 'TIMEFRAME.15m' },
    { value: '30m', label: 'TIMEFRAME.30m' },
    { value: '1H', label: 'TIMEFRAME.1H' },
    { value: '4H', label: 'TIMEFRAME.4H' },
    { value: '1D', label: 'TIMEFRAME.1D' },
    { value: '1W', label: 'TIMEFRAME.1W' },
    { value: '1M', label: 'TIMEFRAME.1M' },
  ];

  changeTimeframe(timeframe: subscribeChannelsCandleType) {
    this.selectedTimeframe = timeframe;
    this.setTimeframe.emit(timeframe);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onClose() {
    this.isDropdownOpen = false;
  }
}
