
import { useState, useEffect } from 'react';
import { Candle } from '../types';

function generateNextCandle(previousCandle: Candle): Candle {
    const timestamp = previousCandle.timestamp + 60000; // 1 minute interval
    const open = previousCandle.close;
    const change = (Math.random() - 0.5) * (open * 0.005);
    let close = open + change;
    let high = Math.max(open, close) + Math.random() * (open * 0.002);
    let low = Math.min(open, close) - Math.random() * (open * 0.002);

    // Ensure OHLC integrity
    if (open > close) {
        high = Math.max(high, open);
        low = Math.min(low, close);
    } else {
        high = Math.max(high, close);
        low = Math.min(low, open);
    }
    
    return { timestamp, open, high, low, close };
}

export const useCandleData = (initialCount: number, intervalMs: number = 3000): Candle[] => {
    const [candles, setCandles] = useState<Candle[]>(() => {
        const initialCandles: Candle[] = [];
        let lastCandle: Candle = {
            timestamp: Date.now() - (initialCount * 60000),
            open: 100,
            high: 101,
            low: 99,
            close: 100.5,
        };
        initialCandles.push(lastCandle);

        for (let i = 1; i < initialCount; i++) {
            lastCandle = generateNextCandle(lastCandle);
            initialCandles.push(lastCandle);
        }
        return initialCandles;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCandles(prevCandles => {
                const nextCandle = generateNextCandle(prevCandles[prevCandles.length - 1]);
                const newCandles = [...prevCandles, nextCandle];
                if (newCandles.length > initialCount + 10) { // Keep buffer from growing too large
                    return newCandles.slice(newCandles.length - initialCount);
                }
                return newCandles;
            });
        }, intervalMs);

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intervalMs]);

    return candles;
};
