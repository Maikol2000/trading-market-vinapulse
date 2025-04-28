import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CandlestickService } from '@app/core/services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent {
  orderForm!: FormGroup;
  selectedSymbol = 'BTC-USDT';
  orderTypes = ['market', 'limit'];
  orderSides = ['buy', 'sell'];

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
      orderType: ['limit', Validators.required],
      side: ['buy', Validators.required],
      quantity: ['0.001', [Validators.required, Validators.min(0.001)]],
      price: ['', Validators.required],
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
      console.log('Order submitted:', orderData);
      // Here you would send the order to the OKX API
      // For demo purposes, we're just logging it
      alert('Order submitted! Check console for details.');
    } else {
      this.orderForm.markAllAsTouched();
    }
  }
}
