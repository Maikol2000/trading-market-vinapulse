export interface ICryptoTrade {
  symbol: string;
  ceiling: number;
  floor: number;
  buyPrice: number;
  buyVolume: number;
  sellPrice: number;
  sellVolume: number;
  lastPrice: number;
  lastVolume: number;
  change24h: number;
  changePercent24h: number;
  timestamp: number;
}
