import { OrderStatusEnum, OrderSideEnum } from '@app/constants/enums';

export interface IOrder {
  orderId: string;
  symbol: string;
  status: OrderStatusEnum;
  side: OrderSideEnum;
  openPrice: string;
  closePrice: string;
  openAt: string;
  closeAt: string;
  takeProfit: string;
  stopLoss: string;
  quantity: string;
  profit: number;
  price: string;
}

export interface ICloseOrderRequest {
  orderId: string;
  closePrice: string;
}

export interface IOrderUpdate {
  orderId: string;
  status: number;
  openPrice: string;
  closePrice: string;
  takeProfit: string;
  stopLoss: string;
  quantity: string;
}
