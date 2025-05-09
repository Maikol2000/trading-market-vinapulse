import { Injectable } from '@angular/core';
import { IResponse } from '@app/shared/models';
import { ApiService } from '@app/shared/services';
import { IOrder } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private service: ApiService) {}

  getOrders() {
    return this.service.get<IResponse<IOrder[]>>(`/orders`);
  }

  addOrder(order: Partial<IOrder>) {
    return this.service.post<IResponse<IOrder>>('/add-orders', order);
  }

  updateOrder(order: Partial<IOrder>) {
    return this.service.post<IResponse<IOrder>>('/update-order', order);
  }
}
