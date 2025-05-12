import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { OrderSideEnum, OrderStatusEnum } from '@app/constants/enums';
import { IOrder } from '@app/core/models';
import { OrderStore } from '@app/core/stores';
import { IHeader } from '@app/shared/models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-portfolio',
  imports: [CommonModule, TranslateModule],
  templateUrl: './order-portfolio.component.html',
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

  orders = signal<IOrder[]>([]);

  activeTab = signal<OrderStatusEnum>(this.orderStatus.OPEN);

  filteredOrders = computed(() => {
    return this.activeTab() && this.orders()?.length
      ? this.orders().filter((order) => order.status === this.activeTab())
      : [];
  });

  constructor() {
    effect(() => {
      if (this.store.orders) {
        this.orders.set(this.store.orders());
      }
    });

    this.store.loadOrders();
  }

  ngOnInit(): void {}

  setActiveTab(tab: OrderStatusEnum): void {
    this.activeTab.set(tab);
  }
}
