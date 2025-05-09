import { InjectionToken } from '@angular/core';
import { OrderState } from '../models';

const initialState: OrderState = {
  loading: false,
  error: null,
  orders: [],
};

export const ORDER_STATE = new InjectionToken<OrderState>('OrderState', {
  factory: () => initialState,
});
