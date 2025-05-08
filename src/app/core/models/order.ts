export interface IOrder {
  orderId: string;
  accountId: string;
  symbol: string;
  type: string;
  status: string;
  side: string;
  openPrice: string;
  closePrice: string;
  openAt: string;
  closeAt: string;
  takeProfit: string;
  stopLoss: string;
  amount: string;
}
