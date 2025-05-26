import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { OrderSideEnum, OrderStatusEnum } from '@app/constants/enums';
import { ICloseOrderRequest, IOrder } from '@app/core/models';
import { OrderStore } from '@app/core/stores';
import { IHeader } from '@app/shared/models';
import { ModalService } from '@app/shared/services';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { UpdateOrderModalComponent } from './update-order-modal/update-order-modal.component';

@Component({
  selector: 'app-order-portfolio',
  imports: [CommonModule, TranslateModule, FontAwesomeModule],
  templateUrl: './order-portfolio.component.html',
})
export class OrderPortfolioComponent implements AfterViewInit {
  store = inject(OrderStore);

  orderStatus = OrderStatusEnum;
  orderSide = OrderSideEnum;

  editIcon = faEdit;
  xMarkCircleIcon = faXmarkCircle;

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
      ? this.orders().filter((order) => order?.status === this.activeTab())
      : [];
  });

  constructor(private modalService: ModalService) {
    effect(() => {
      if (this.store.orders) {
        this.orders.set(this.store.orders());
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.store.loadOrders();
  }

  setActiveTab(tab: OrderStatusEnum): void {
    this.activeTab.set(tab);
  }

  onUpdateOrder(
    symbol: string,
    volume: number,
    currency: string = '$',
    stopLoss: number,
    takeProfit: number
  ) {
    const modalRef = this.modalService.open(UpdateOrderModalComponent, {
      order: {
        symbol,
        volume,
        currency,
        openPrice: 0,
        // currentPrice: 0,
        stopLoss,
        takeProfit,
      },
    });
    const instance = modalRef.instance;

    instance.close.subscribe(() => {
      console.log('run close');
    });
  }

  onCloseOrder(orderId: string, closePrice: string) {
    const close: ICloseOrderRequest = {
      closePrice,
      orderId,
    };
    this.store.closeOrder(close);
  }
}
