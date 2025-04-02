import { Component } from '@angular/core';
import { FinancialChartComponent } from '@app/components/trade-market';

@Component({
  selector: 'app-trade-market',
  imports: [FinancialChartComponent],
  templateUrl: './trade-market.component.html',
  styleUrl: './trade-market.component.scss',
})
export class TradeMarketComponent {}
