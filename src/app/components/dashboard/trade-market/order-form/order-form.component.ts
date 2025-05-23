import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OrderSideEnum, OrderStatusEnum } from '@app/constants/enums';
import { ICrystal, IOrder } from '@app/core/models';
import { CandlestickService } from '@app/core/services';
import { CrystalStore, OrderStore } from '@app/core/stores';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent {
  private orderStore = inject(OrderStore);
  private crystalStore = inject(CrystalStore);

  selectedSymbol = signal('BTC-USDT');

  orderForm!: FormGroup;

  orderStatus = OrderStatusEnum;
  orderSide = OrderSideEnum;

  crystal = signal<Partial<ICrystal>>({});

  constructor(
    private fb: FormBuilder,
    private candlestickService: CandlestickService,
    private router: Router
  ) {
    this.setRouter();
    this.router.events.subscribe(() => {
      this.setRouter();
    });

    effect(() => {
      if (this.crystalStore.crystal()) {
        this.crystal.set(this.crystalStore.crystal());
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeCurrentPrice();
  }

  setRouter() {
    const urls = this.router.url.split('/');
    this.selectedSymbol.set(urls[urls.length - 1]);
  }

  initForm() {
    this.orderForm = this.fb.group({
      symbol: [this.selectedSymbol(), Validators.required],
      side: [OrderSideEnum.BUY, Validators.required],
      quantity: ['0.001', [Validators.required, Validators.min(0.001)]],
      tp: ['', Validators.required],
      sl: [''],
      status: [OrderStatusEnum.OPEN, Validators.required],
    });
  }

  subscribeCurrentPrice() {
    this.candlestickService.serries$.subscribe({
      next: (data) => {
        const price = data.candles?.close ?? 0;
        this.orderForm.get('tp')?.setValue(price.toString());
      },
      error: (err) => {
        console.error('Error fetching current price:', err);
      },
    });
  }

  submitOrder(): void {
    if (this.orderForm.valid) {
      const orderData: Partial<IOrder> = {
        symbol: this.orderForm.value.symbol,
        status: this.orderForm.value.status,
        side: this.orderForm.value.side,
        openPrice: this.crystal().openPrice?.toString() ?? '0',
        closePrice: this.crystal().closePrice?.toString() ?? '0',
        takeProfit: this.orderForm.value.tp,
        stopLoss: this.orderForm.value.sl.toString(),
        quantity: this.orderForm.value.quantity,
      };
      this.orderStore.addOrder(orderData);
      this.orderStore.loadOrders();
    } else {
      this.orderForm.markAllAsTouched();
    }
  }
}
