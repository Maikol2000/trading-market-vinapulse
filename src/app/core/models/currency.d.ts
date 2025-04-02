export interface ICurrencyData {
  symbol: string;
  ceiling: number;
  floor: number;
  buyTrade: {
    price: number;
    volume: number;
  };
  sellTrade: {
    price: number;
    volume: number;
  };
  matchedTrade: {
    price: number;
    volume: number;
  };
  lastUpdate: Date;
}
