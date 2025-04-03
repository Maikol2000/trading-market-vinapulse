export interface IOrderBook {
  asks: OrderBookLevel[];
  bids: OrderBookLevel[];
  spread: number;
  spreadPercentage: number;
  timestamp: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number; // Cumulative size
  percentage: number; // For visualization scaling
}
