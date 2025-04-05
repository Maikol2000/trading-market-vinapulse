import { Component } from '@angular/core';
import { OrderFormComponent } from '@app/components/dashboard/order';

@Component({
  selector: 'app-order',
  imports: [OrderFormComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {}
