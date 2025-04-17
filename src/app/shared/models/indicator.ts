export interface Indicator {
  id: IdIndicator;
  name: string;
  description: string;
  icon: any;
  isActive: boolean;
  type: 'trend' | 'momentum' | 'volume' | 'volatility';
}

export type IdIndicator = 'rsi' | 'sma' | 'ema' | 'bb';
