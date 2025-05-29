import { Injectable } from '@angular/core';
import { IResponse } from '@app/shared/models';
import { ApiService } from '@app/shared/services';
import { ICloseOrderRequest, IOrder, IOrderUpdate } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private service: ApiService) {}

  getOrders() {
    return this.service.get<IResponse<IOrder[]>>(`/order/list`);
  }

  addOrder(order: Partial<IOrder>) {
    return this.service.post<IResponse<IOrder>>('/order/create', order);
  }

  updateOrder(order: Partial<IOrderUpdate>) {
    return this.service.post<IResponse<IOrder>>('/order/update', order);
  }

  closeOrder(closeOd: ICloseOrderRequest) {
    return this.service.post<IResponse<IOrder>>('/order/close', closeOd);
  }
}
