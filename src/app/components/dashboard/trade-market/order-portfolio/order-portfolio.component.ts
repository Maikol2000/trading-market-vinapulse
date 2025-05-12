import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { OrderStatusEnum, OrderSideEnum } from '@app/constants/enums';
import { IOrder } from '@app/core/models';
import { OrderStore } from '@app/core/stores';
import { IHeader } from '@app/shared/models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-portfolio',
  imports: [CommonModule, TranslateModule],
  templateUrl: './order-portfolio.component.html',
  providers: [OrderStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPortfolioComponent {
  store = inject(OrderStore);

  orderStatus = OrderStatusEnum;
  orderSide = OrderSideEnum;

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

  activeTab = signal<OrderStatusEnum>(this.orderStatus.ClOSED);
  filteredOrders: IOrder[] = [];

  constructor() {
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

  setActiveTab(tab: OrderStatusEnum): void {
    this.activeTab.set(tab);
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(
      (order) => order.status === this.activeTab()
    );
  }
}
