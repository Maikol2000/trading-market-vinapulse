import { IOrder } from '@app/core/models';

export interface OrderState {
  loading: boolean;
  error: string | null;
  orders: IOrder[];
}
