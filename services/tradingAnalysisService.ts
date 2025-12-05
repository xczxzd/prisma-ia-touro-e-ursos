
import { Candle, Signal, TradingDirection, Pattern } from '../types';
import { CANDLESTICK_PATTERNS } from '../constants';

export function analisarCandles(candles: Candle[]): Signal | null {
    const patterns = Object.values(CANDLESTICK_PATTERNS);

    // Iterate backwards to find the most recent pattern
    for (const pattern of patterns) {
        if (pattern.logic(candles)) {
            let direction: TradingDirection;
            let confidence: number;

            switch (pattern.type) {
                case 'Bullish':
                    direction = TradingDirection.CALL;
                    confidence = 85;
                    break;
                case 'Bearish':
                    direction = TradingDirection.PUT;
                    confidence = 85;
                    break;
                default:
                    direction = TradingDirection.NEUTRAL;
                    confidence = 50;
            }

            if (direction !== TradingDirection.NEUTRAL) {
                 return {
                    direction,
                    confidence,
                    pattern,
                    timestamp: candles[candles.length - 1].timestamp,
                };
            }
        }
    }

    return null;
}
