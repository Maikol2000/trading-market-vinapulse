import { Component } from '@angular/core';
import { OrderFormComponent } from '@app/components/dashboard/order';
import { FinancialChartComponent } from '@app/components/dashboard/trade-market';

@Component({
  selector: 'app-trade-market',
  imports: [FinancialChartComponent, OrderFormComponent],
  templateUrl: './trade-market.component.html',
  styleUrl: './trade-market.component.scss',
})
export class TradeMarketComponent {}
