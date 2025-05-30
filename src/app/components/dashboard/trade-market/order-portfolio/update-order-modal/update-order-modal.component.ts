import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderSideEnum } from '@app/constants/enums';
import { OrderService } from '@app/core/services';
import { ModalComponent } from '@app/shared/components';
import { TranslateModule } from '@ngx-translate/core';

export interface IIptOrder {
  orderId: string;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateOrderModalComponent {
  @Output() close = new EventEmitter<boolean>(false);
  @Input() order: Partial<IIptOrder> = {};

  orderForm!: FormGroup;

  // Tab đang được chọn
  activeTab: 'edit' | 'closePartial' = 'edit';

  // Tính toán số tiền lỗ/lãi khi đóng một phần
  estimatedProfit = -218.9;

  constructor(private service: OrderService, private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.orderForm.patchValue({
      takeProfit: this.order.takeProfit || 0,
      stopLoss: this.order.stopLoss || 0,
      closeVolume: this.order.volume || 0,
    });
    this.orderForm
      .get('closeVolume')
      ?.setValidators([
        Validators.required,
        Validators.min(0.01),
        Validators.max(this.order.volume || 0),
      ]);
  }

  initForm() {
    this.orderForm = this.fb.group({
      takeProfit: [0],
      stopLoss: [0],
      closeVolume: [0],
    });
  }

  // Chuyển đổi tab
  setActiveTab(tab: 'edit' | 'closePartial'): void {
    this.activeTab = tab;
  }

  // Xóa giá trị input
  clearInput(field: 'takeProfit' | 'stopLoss'): void {
    if (field === 'takeProfit') {
      const control = this.orderForm.get('takeProfit');
      control?.setValue(0);
    } else {
      const control = this.orderForm.get('stopLoss');
      control?.setValue(0);
    }
  }

  // Tăng/giảm giá trị
  adjustValue(
    field: 'takeProfit' | 'stopLoss' | 'closeVolume',
    increment: boolean
  ): void {
    let value: number = 0;
    let step = 10;
    let control: AbstractControl<any, any> | null;

    switch (field) {
      case 'takeProfit':
        control = this.orderForm.get('takeProfit');
        break;
      case 'stopLoss':
        control = this.orderForm.get('stopLoss');
        break;
      default:
        step = 0.01;
        control = this.orderForm.get('closeVolume');
        break;
    }

    value = +control?.value || 0;
    control?.setValue(+(increment ? value + step : value - step).toFixed(2));
  }

  // Sửa đổi lệnh giao dịch
  updateOrder(): void {
    const formValues = this.orderForm.value;
    // if (this.orderForm.invalid) {
    //   this.markRead();
    //   return;
    // }
    this.service
      .updateOrder({
        orderId: this.order.orderId,
        stopLoss: formValues.stopLoss.toString(),
        takeProfit: formValues.takeProfit.toString(),
      })
      .subscribe((resp) => {
        // Xử lý sau khi đóng lệnh thành công
        if (resp.value) {
          this.onClose(true);
        }
      });
  }

  // Đóng một phần lệnh
  closePartialOrder(): void {
    if (this.orderForm.valid) {
      const formValues = this.orderForm.value;
      if (+formValues.closeVolume > (this.order.volume || 0)) {
        return;
      }

      this.service
        .updateOrder({
          orderId: this.order.orderId,
          quantity: formValues.closeVolume.toString(),
        })
        .subscribe((resp) => {
          // Xử lý sau khi đóng lệnh thành công
          if (resp.value) {
            this.onClose(true);
          }
        });
    } else {
      this.orderForm.markAllAsTouched();
    }
  }

  // Helper method to get error message
  getCloseVolumeError(): string {
    const control = this.orderForm.get('closeVolume');
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Volume is required';
      }
      if (control.errors['min']) {
        return 'Minimum volume is 0.01';
      }
      if (control.errors['max']) {
        return `Maximum volume is ${this.order.volume}`;
      }
    }
    return '';
  }

  onClose(val: boolean = false) {
    this.close.emit(val);
  }
}
