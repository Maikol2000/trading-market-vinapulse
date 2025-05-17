export interface ICrystal {
  symbol: string;
  name: string;
  marketCap: number;
  price: number;
  circulatingSupply: number;
  tradingVolume: number;
  high24h: number;
  low24h: number;
  averagePrice: number;
  openPrice: number;
  closePrice: number;
  volume24h: number;
  priceChangePercent: number;
  lastUpdated: Date;
}
