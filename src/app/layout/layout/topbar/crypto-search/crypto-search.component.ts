import { Component } from '@angular/core';
import { ApiOKSService } from '@app/shared/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crypto-search',
  imports: [],
  templateUrl: './crypto-search.component.html',
  styleUrl: './crypto-search.component.scss',
})
export class CryptoSearchComponent {
  constructor(private service: ApiOKSService) {}

  // Get crypto market data
  getMarketData(instType: string = 'SPOT'): Observable<any> {
    return this.service.getOKX(`/market/tickers?instType=${instType}`);
  }

  // Search crypto by symbol or name
  searchCrypto(query: string, instType: string = 'SPOT'): Observable<any> {
    return this.service.getOKX(`/market/tickers?instType=${instType}`);
    // Note: OKX API doesn't support direct search by name or symbol,
    // We will filter results on the frontend
  }

  // Get detailed information for a specific cryptocurrency
  getCryptoDetails(symbol: string): Observable<any> {
    return this.service.getOKX(`/market/ticker?instId=${symbol}`);
  }
}
