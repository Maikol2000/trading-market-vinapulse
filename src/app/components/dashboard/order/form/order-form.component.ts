import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IOKXTicker } from '@app/core/models';
import { OrderService } from '@app/core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent {
  orderForm: FormGroup;
  tickerData: IOKXTicker | null = null;
  currentPrice: number = 0;
  floorPrice: number = 0;
  ceilingPrice: number = 0;
  averagePrice: number = 0;
  private subscriptions = new Subscription();
  selectedSymbol = 'BTC-USDT';
  orderTypes = ['market', 'limit'];
  orderSides = ['buy', 'sell'];

  constructor(private fb: FormBuilder, private okxService: OrderService) {
    this.orderForm = this.fb.group({
      symbol: [this.selectedSymbol, Validators.required],
      orderType: ['limit', Validators.required],
      side: ['buy', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.0001)]],
      price: ['', Validators.required],
      maxPrice: [''],
    });
  }

  ngOnInit(): void {
    this.connectToSymbol(this.selectedSymbol);

    // Subscribe to real-time ticker updates
    this.subscriptions.add(
      this.okxService.ticker$.subscribe((data) => {
        if (data) {
          this.tickerData = data;
          this.updatePriceInfo();
        }
      })
    );

    // Update price when order type changes
    this.subscriptions.add(
      this.orderForm.get('orderType')?.valueChanges.subscribe((type) => {
        if (type === 'market') {
          this.orderForm.get('price')?.disable();
          this.orderForm.get('maxPrice')?.disable();
        } else {
          this.orderForm.get('price')?.enable();
          this.orderForm.get('maxPrice')?.enable();
        }
      }) || new Subscription()
    );

    // Update symbol if changed
    this.subscriptions.add(
      this.orderForm.get('symbol')?.valueChanges.subscribe((symbol) => {
        if (symbol && symbol !== this.selectedSymbol) {
          this.selectedSymbol = symbol;
          this.connectToSymbol(symbol);
        }
      }) || new Subscription()
    );
  }

  connectToSymbol(symbol: string): void {
    // First get initial data
    this.okxService.getTickerData(symbol).subscribe((response) => {
      if (response.data && response.data.length > 0) {
        this.tickerData = response.data[0];
        this.updatePriceInfo();

        // Then connect WebSocket for real-time updates
        this.okxService.connectWebSocket(symbol);
      }
    });
  }

  updatePriceInfo(): void {
    if (this.tickerData) {
      this.currentPrice = parseFloat(this.tickerData.last);
      this.floorPrice = parseFloat(this.tickerData.low24h);
      this.ceilingPrice = parseFloat(this.tickerData.high24h);

      // Calculate average price (between high and low of 24h)
      this.averagePrice = (this.floorPrice + this.ceilingPrice) / 2;

      // Pre-fill the form with current price if price is empty
      if (!this.orderForm.get('price')?.value) {
        this.orderForm.get('price')?.setValue(this.currentPrice);
      }
    }
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.okxService.disconnectWebSocket();
  }
}
