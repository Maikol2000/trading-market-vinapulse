// okx.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OkxApiService } from '@app/services/okx-api.service';

@Component({
  selector: 'app-okx',
  imports: [CommonModule],
  templateUrl: './okx.component.html',
  styleUrls: ['./okx.component.scss'],
})
export class OkxComponent implements OnInit {
  marketData: any[] = [];
  accountBalance: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private okxApiService: OkxApiService) {}

  ngOnInit(): void {
    this.getBTCTicker();
  }

  getBTCTicker(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.okxApiService.getTicker('BTC-USDT').subscribe({
      next: (response) => {
        if (response && response.data) {
          this.marketData = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error fetching ticker data: ${error.message}`;
        this.isLoading = false;
      },
    });
  }

  getAccountBalance(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.okxApiService.getAccountBalance().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.accountBalance = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error fetching account balance: ${error.message}`;
        this.isLoading = false;
      },
    });
  }

  placeOrder(): void {
    // Example order parameters
    const orderParams = {
      instId: 'BTC-USDT',
      tdMode: 'cash',
      side: 'buy',
      ordType: 'limit',
      px: '20000',
      sz: '0.001',
    };

    this.isLoading = true;
    this.errorMessage = '';

    this.okxApiService.placeOrder(orderParams).subscribe({
      next: (response) => {
        console.log('Order placed:', response);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error placing order: ${error.message}`;
        this.isLoading = false;
      },
    });
  }
}
