import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { IOrder } from '@app/core/models';
import { OrderService } from '@app/core/services';
import { OrderStore } from '@app/core/stores';
import { IHeader } from '@app/shared/models';
import { TranslateModule } from '@ngx-translate/core';

type OrderStatus = 'open' | 'closed' | 'pending';

@Component({
  selector: 'app-order-portfolio',
  imports: [CommonModule, TranslateModule],
  templateUrl: './order-portfolio.component.html',
  providers: [OrderStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPortfolioComponent {
  store = inject(OrderStore);

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

  orders = this.store.orders();

  activeTab = signal<OrderStatus>('open');
  filteredOrders: IOrder[] = [];

  constructor(private orderService: OrderService) {
    effect(() => {
      if (this.activeTab()) {
        this.filterOrders();
      }
    });
    this.store.loadOrders();
  }

  ngOnInit(): void {
    this.filterOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe((res) => {
      console.log(res);
    });
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
