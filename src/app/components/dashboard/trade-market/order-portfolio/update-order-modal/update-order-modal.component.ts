import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderSideEnum } from '@app/constants/enums';
import { ModalComponent } from '@app/shared/components';
import { TranslateModule } from '@ngx-translate/core';

export interface IIptOrder {
  symbol: string;
  volume: number;
  currency: string;
  type: OrderSideEnum;
  openPrice: number;
  currentPrice: number;
  takeProfit: number;
  stopLoss: number;
}

@Component({
  selector: 'app-update-order-modal',
  imports: [
    CommonModule,
    TranslateModule,
    ModalComponent,
    ReactiveFormsModule,
    NgClass,
    FormsModule,
  ],
  templateUrl: './update-order-modal.component.html',
  styleUrl: './update-order-modal.component.scss',
})
export class UpdateOrderModalComponent {
  @Output() close = new EventEmitter<void>();
  @Input() order: Partial<IIptOrder> = {};

  // Giá trị chốt lời
  takeProfit = this.order.takeProfit ?? null;
  stopLoss = this.order.stopLoss ?? null;
  closeVolume = this.order.volume;
  profitLoss: number = 0;

  // Tab đang được chọn
  activeTab: 'edit' | 'closePartial' = 'edit';

  // Tính toán số tiền lỗ/lãi khi đóng một phần
  estimatedProfit = -218.9;
  constructor() {}

  ngOnInit(): void {}

  // Chuyển đổi tab
  setActiveTab(tab: 'edit' | 'closePartial'): void {
    this.activeTab = tab;
  }

  // Xóa giá trị input
  clearInput(field: 'takeProfit' | 'stopLoss'): void {
    if (field === 'takeProfit') {
      this.takeProfit = 0;
    } else {
      this.stopLoss = null;
    }
  }

  // Tăng/giảm giá trị
  adjustValue(
    field: 'takeProfit' | 'stopLoss' | 'closeVolume',
    increment: boolean
  ): void {
    let value: number;
    let step = 1;

    if (field === 'takeProfit') {
      value = this.takeProfit || 0;
      this.takeProfit = increment ? value + step : value - step;
    } else if (field === 'stopLoss') {
      value = this.stopLoss || 0;
      this.stopLoss = increment ? value + step : value - step;
    } else {
      value = this.closeVolume || 0;
      if (value >= 0.01) {
        this.closeVolume = increment ? value + 0.01 : value - 0.01;
      }
    }
  }

  // Sửa đổi lệnh giao dịch
  updateOrder(): void {
    console.log(
      'Cập nhật lệnh với chốt lời:',
      this.takeProfit,
      'cắt lỗ:',
      this.stopLoss
    );
    // Gọi API hoặc service để cập nhật lệnh
  }

  // Đóng một phần lệnh
  closePartialOrder(): void {
    console.log('Đóng một phần lệnh với khối lượng:', this.closeVolume);
    // Gọi API hoặc service để đóng một phần lệnh
  }
  onClose() {
    this.close.emit();
  }
}
