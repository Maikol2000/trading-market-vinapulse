import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderStatusEnum, OrderSideEnum } from '@app/constants/enums';
import { CandlestickService } from '@app/core/services';
import { OrderStore } from '@app/core/stores';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent {
  private store = inject(OrderStore);

  orderForm!: FormGroup;
  selectedSymbol = 'BTC-USDT';

  orderStatus = OrderStatusEnum;
  orderSide = OrderSideEnum;

  constructor(
    private fb: FormBuilder,
    private candlestickService: CandlestickService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.subscribeCurrentPrice();
  }

  initForm() {
    this.orderForm = this.fb.group({
      symbol: [this.selectedSymbol, Validators.required],
      side: [OrderSideEnum.BUY, Validators.required],
      quantity: ['0.001', [Validators.required, Validators.min(0.001)]],
      price: ['', Validators.required],
      status: [OrderStatusEnum.OPEN, Validators.required],
    });
  }

  subscribeCurrentPrice() {
    this.candlestickService.serries$.subscribe({
      next: (data) => {
        const price = data.candles?.close ?? 0;
        this.orderForm.get('price')?.setValue(price);
      },
      error: (err) => {
        console.error('Error fetching current price:', err);
      },
    });
  }

  submitOrder(): void {
    if (this.orderForm.valid) {
      const orderData = this.orderForm.value;
      this.store.addOrder(orderData);
    } else {
      this.orderForm.markAllAsTouched();
    }
  }
}
