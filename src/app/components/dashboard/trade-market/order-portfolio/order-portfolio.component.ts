import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { IHeader } from '@app/shared/models';
import { TranslateModule } from '@ngx-translate/core';

interface Order {
  symtal: string;
  type: OrderType;
  quantity: number;
  closePrice?: number;
  profitLoss: number;
  status: OrderStatus;
}

type OrderStatus = 'open' | 'closed' | 'pending';
type OrderType = 'Buy' | 'Sell';

@Component({
  selector: 'app-order-portfolio',
  imports: [CommonModule, TranslateModule],
  templateUrl: './order-portfolio.component.html',
})
export class OrderPortfolioComponent {
  headers: IHeader[] = [
    {
      label: 'TRADE.ORDER_PORPOLIO.TABLE_COLUMNS.SYMBOL',
    },
    {
      label: 'TRADE.ORDER_PORPOLIO.TABLE_COLUMNS.ORDER_TYPE',
    },
    {
      label: 'TRADE.ORDER_PORPOLIO.TABLE_COLUMNS.QUANTITY',
    },
    {
      label: 'TRADE.ORDER_PORPOLIO.TABLE_COLUMNS.PRICE',
    },
    {
      label: 'TRADE.ORDER_PORPOLIO.TABLE_COLUMNS.PROFIT',
    },
  ];

  orders: Order[] = [
    {
      symtal: 'XAUUSD',
      type: 'Buy',
      quantity: 0.01,
      closePrice: 3305.938,
      profitLoss: -19.95,
      status: 'open',
    },
    {
      symtal: 'USDJPY',
      type: 'Sell',
      quantity: 0.5,
      closePrice: 143.634,
      profitLoss: -32.37,
      status: 'open',
    },
    {
      symtal: 'BTC',
      type: 'Sell',
      quantity: 1,
      profitLoss: -162.15,
      status: 'closed',
    },
    {
      symtal: 'XAUUSD',
      type: 'Buy',
      quantity: 0.01,
      profitLoss: -0.09,
      status: 'closed',
    },
    {
      symtal: 'USDJPY',
      type: 'Buy',
      quantity: 0.5,
      closePrice: 143.815,
      profitLoss: 12.86,
      status: 'pending',
    },
    {
      symtal: 'USDJPY',
      type: 'Sell',
      quantity: 0.5,
      closePrice: 143.779,
      profitLoss: 18.08,
      status: 'pending',
    },
  ];

  activeTab = signal<OrderStatus>('open');
  filteredOrders: Order[] = [];

  constructor() {
    effect(() => {
      if (this.activeTab()) {
        this.filterOrders();
      }
    });
  }

  ngOnInit(): void {
    this.filterOrders();
  }

  setActiveTab(tab: OrderStatus): void {
    this.activeTab.set(tab);
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(
      (order) => order.status === this.activeTab()
    );
  }
}
