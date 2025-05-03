import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@app/shared/components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';

interface Instrument {
  symbol: string;
  name: string;
  category: 'crypto' | 'stock' | 'forex';
}
@Component({
  selector: 'app-ticket-modal',
  imports: [
    CommonModule,
    TranslateModule,
    ModalComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './ticket-modal.component.html',
  styleUrl: './ticket-modal.component.scss',
})
export class TicketModalComponent {
  @Output() selectInstrument = new EventEmitter<Instrument>();
  @Output() close = new EventEmitter<void>();

  searchControl = new FormControl('');
  faSearch = faSearch;

  instruments = signal<Instrument[]>([
    { symbol: 'BTC-USDT', name: 'Bitcoin', category: 'crypto' },
    { symbol: 'ETH-USDT', name: 'Ethereum', category: 'crypto' },
    // Add more instruments as needed
  ]);

  filteredInstruments = signal<Instrument[]>(this.instruments());

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.filterInstruments(searchTerm || '');
      });
  }

  private filterInstruments(searchTerm: string) {
    const term = searchTerm.toLowerCase();
    this.filteredInstruments.set(
      this.instruments().filter(
        (instrument) =>
          instrument.symbol.toLowerCase().includes(term) ||
          instrument.name.toLowerCase().includes(term)
      )
    );
  }

  onInstrumentSelect(instrument: Instrument) {
    this.selectInstrument.emit(instrument);
  }
}
