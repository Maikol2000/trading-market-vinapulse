import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { CandlestickService } from '@app/core/services';
import { GaugeChartComponent } from '@app/shared/components';
import { TranslateModule } from '@ngx-translate/core';
import { CandlestickData, Time } from 'lightweight-charts';

interface Indicators {
  sma50?: number;
  sma200?: number;
  rsi?: number;
  macd?: {
    MACD: number;
    signal: number;
    histogram: number;
  };
}

type SignalType = 'BUY' | 'SELL' | 'NEUTRAL';

@Component({
  selector: 'app-technical-gauge-chart',
  imports: [CommonModule, TranslateModule, GaugeChartComponent],
  templateUrl: './technical-gauge-chart.component.html',
  styleUrl: './technical-gauge-chart.component.scss',
})
export class TechnicalGaugeChartComponent {
  gaugeValue = signal(0);
  customizeText = (arg: { value: number }) => {
    return `${arg.value}%`;
  };

  smaSignal = signal<SignalType>('NEUTRAL');
  rsiSignal = signal<SignalType>('NEUTRAL');
  macdSignal = signal<SignalType>('NEUTRAL');

  // Define the indicators with their initial signals
  mlPredictionSignal = signal<SignalType>('NEUTRAL');
  lstmSignal = signal<SignalType>('NEUTRAL');

  indicators = computed<{ name: string; signal: SignalType }[]>(() => [
    { name: 'SMA', signal: this.smaSignal() },
    { name: 'RSI', signal: this.rsiSignal() },
    { name: 'MACD', signal: this.macdSignal() },
    { name: 'ML Prediction', signal: this.mlPredictionSignal() },
    { name: 'LSTM', signal: this.lstmSignal() },
  ]);

  symbol = 'BTC-USDT';

  closePrices = signal<number[]>([]);

  candle = signal<CandlestickData<Time>[]>([]);

  constructor(private service: CandlestickService) {
    this.getHistoryCandle();
    this.service.setSubcribe(this.symbol, '1m');
    this.service.connectWebSocket();
    this.service.serries$.subscribe((resp) => {
      if (resp.candles) {
        const { candles } = resp;
        this.candle.update((c) => [...c, candles]);
        const { close } = resp.candles;
        this.closePrices.update((c) => [...c, close]);
        const rsi = this.calculateRSI(this.closePrices().slice(-100));
        this.updateGauge(rsi);
      }
    });

    effect(() => {
      const candles = this.candle();
      if (candles.length > 0) {
        const lastCandle = candles[candles.length - 1];
        this.interpretSignals(lastCandle);
      }
    });
  }

  ngOnInit() {}

  calculateRSI(closes: number[]): number {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= 100; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }

    const avgGain = gains / 100;
    const avgLoss = losses / 100;

    const rs = avgGain / (avgLoss || 1);
    const rsi = 100 - 100 / (1 + rs);
    return rsi;
  }

  updateGauge(value: number) {
    this.gaugeValue.set(value);
  }

  getHistoryCandle() {
    this.service.getHistoryMarkets(this.symbol, '1m', 200).subscribe((resp) => {
      if (resp.candles) {
        const cls = resp.candles.map((c) => c.close);

        this.candle.set(resp.candles ?? []);
        this.closePrices.set(cls);

        //handle calculating gauge value
        const rsi = this.calculateRSI(cls);
        this.updateGauge(rsi);
      }
    });
  }

  calculateEMA(values: number[], period: number): number[] {
    if (values.length < period) {
      return [];
    }

    const emaValues: number[] = [];
    const multiplier = 2 / (period + 1);

    // Tính SMA cho điểm khởi đầu của EMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += values[i];
    }
    emaValues.push(sum / period);

    // Tính EMA cho các điểm tiếp theo
    for (let i = period; i < values.length; i++) {
      const prevEma = emaValues[emaValues.length - 1];
      const currentEma = (values[i] - prevEma) * multiplier + prevEma;
      emaValues.push(currentEma);
    }
    return emaValues;
  }

  calculateIndicators() {
    const closePrices = this.candle().map((c) => c.close);

    // Kiểm tra đủ dữ liệu cho các chỉ báo
    if (closePrices.length < 200) {
      return null;
    }

    const indicators: Indicators = {};

    // --- SMA (Simple Moving Average) ---
    const calculateSMA = (
      values: number[],
      period: number
    ): number | undefined => {
      if (values.length < period) {
        return undefined;
      }
      const relevantValues = values.slice(-period); // Lấy N giá trị cuối cùng
      const sum = relevantValues.reduce((acc, val) => acc + val, 0);
      return sum / period;
    };

    indicators.sma50 = calculateSMA(closePrices, 50);
    indicators.sma200 = calculateSMA(closePrices, 200);

    // --- RSI (Relative Strength Index) ---
    const calculateRSI = (
      values: number[],
      period: number
    ): number | undefined => {
      if (values.length < period + 1) {
        // Cần ít nhất period + 1 để tính thay đổi đầu tiên
        return undefined;
      }

      let avgGain = 0;
      let avgLoss = 0;

      // Tính gain/loss cho 'period' nến đầu tiên
      for (let i = 1; i <= period; i++) {
        const diff = values[i] - values[i - 1];
        if (diff > 0) {
          avgGain += diff;
        } else {
          avgLoss += Math.abs(diff);
        }
      }
      avgGain /= period;
      avgLoss /= period;

      let rs = avgGain / avgLoss;
      let rsi = 100 - 100 / (1 + rs);

      // Tính cho các nến còn lại
      for (let i = period + 1; i < values.length; i++) {
        const diff = values[i] - values[i - 1];
        let gain = 0;
        let loss = 0;

        if (diff > 0) {
          gain = diff;
        } else {
          loss = Math.abs(diff);
        }

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        rs = avgGain / avgLoss;
        rsi = 100 - 100 / (1 + rs);
      }
      // Trả về RSI của nến cuối cùng
      return isNaN(rsi) ? undefined : rsi;
    };

    indicators.rsi = calculateRSI(closePrices, 14);
    const fastPeriod = 12;
    const slowPeriod = 26;
    const signalPeriod = 9;

    if (closePrices.length >= slowPeriod + signalPeriod - 1) {
      const fastEmaValues = this.calculateEMA(closePrices, fastPeriod);
      const slowEmaValues = this.calculateEMA(closePrices, slowPeriod);

      if (fastEmaValues.length >= 1 && slowEmaValues.length >= 1) {
        const minLength = Math.min(fastEmaValues.length, slowEmaValues.length);
        for (let i = 0; i < minLength; i++) {
          const currentFastEma = this.calculateEMA(
            closePrices.slice(0, closePrices.length),
            fastPeriod
          );
          const currentSlowEma = this.calculateEMA(
            closePrices.slice(0, closePrices.length),
            slowPeriod
          );

          if (currentFastEma.length > 0 && currentSlowEma.length > 0) {
            const startIndexMACD = Math.max(fastPeriod, slowPeriod) - 1;
            const macdLineArr: number[] = [];
            for (let i = startIndexMACD; i < closePrices.length; i++) {
              const fastEmaAtI = this.calculateEMA(
                closePrices.slice(0, i + 1),
                fastPeriod
              ).slice(-1)[0];
              const slowEmaAtI = this.calculateEMA(
                closePrices.slice(0, i + 1),
                slowPeriod
              ).slice(-1)[0];
              if (fastEmaAtI !== undefined && slowEmaAtI !== undefined) {
                macdLineArr.push(fastEmaAtI - slowEmaAtI);
              }
            }

            // 3. Tính Signal Line = EMA(MACD_L, signalPeriod)
            const signalLineArr = this.calculateEMA(macdLineArr, signalPeriod);

            if (macdLineArr.length > 0 && signalLineArr.length > 0) {
              const lastMACDLine = macdLineArr[macdLineArr.length - 1];
              const lastSignalLine = signalLineArr[signalLineArr.length - 1];
              const histogram = lastMACDLine - lastSignalLine;

              indicators.macd = {
                MACD: lastMACDLine,
                signal: lastSignalLine,
                histogram: histogram,
              };
            }
          }
        }
      }
    }

    return indicators;
  }

  interpretSignals(lastCandle: CandlestickData) {
    const indicators = this.calculateIndicators();
    if (!indicators) return;

    const { sma50, sma200, rsi, macd } = indicators;
    const currentPrice = lastCandle.close;

    // --- Tín hiệu từ SMA ---
    if (sma50 !== undefined && sma200 !== undefined) {
      // console.log(`  SMA50: ${sma50.toFixed(2)}, SMA200: ${sma200.toFixed(2)}`);
      if (currentPrice > sma50) {
        // console.log('    [SMA] Giá trên SMA50 (+1 MUA)');
        this.indicators;
        if (sma50 > sma200) {
          this.smaSignal.set('BUY');
        }
      } else if (currentPrice < sma50) {
        this.smaSignal.set('SELL');

        if (sma50 < sma200) {
          this.smaSignal.set('SELL');
        }
      } else {
        this.smaSignal.set('NEUTRAL');
      }
    } else {
      this.smaSignal.set('NEUTRAL');
    }

    // --- Tín hiệu từ RSI ---
    if (rsi !== undefined) {
      if (rsi < 30) {
        this.rsiSignal.set('BUY');
      } else if (rsi > 70) {
        this.rsiSignal.set('SELL');
      } else {
        this.rsiSignal.set('NEUTRAL');
      }
    } else {
      this.rsiSignal.set('NEUTRAL');
    }

    // --- Tín hiệu từ MACD ---
    if (macd?.MACD !== undefined && macd?.signal !== undefined) {
      if (macd.MACD > macd.signal) {
        this.macdSignal.set('BUY');
      } else if (macd.MACD < macd.signal) {
        this.macdSignal.set('SELL');
      } else {
        this.macdSignal.set('NEUTRAL');
      }
    } else {
      this.macdSignal.set('NEUTRAL');
    }
  }
}
