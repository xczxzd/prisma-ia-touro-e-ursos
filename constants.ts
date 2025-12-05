
import { Pattern, Candle, TradingDirection } from './types';

const isBullish = (candle: Candle) => candle.close > candle.open;
const isBearish = (candle: Candle) => candle.open > candle.close;
const body = (candle: Candle) => Math.abs(candle.close - candle.open);
const upperWick = (candle: Candle) => candle.high - Math.max(candle.open, candle.close);
const lowerWick = (candle: Candle) => Math.min(candle.open, candle.close) - candle.low;

// Padrão placeholder para sinais gerados pela IA
export const AI_PATTERN: Pattern = {
    name: 'Análise Prisma AI',
    type: 'Artificial Intelligence',
    description: 'Sinal gerado por inteligência artificial baseada em Price Action avançado e leitura de fluxo.',
    logic: () => true // Lógica dummy, pois o sinal vem externamente
};

export const CANDLESTICK_PATTERNS: Record<string, Pattern> = {
    BULLISH_ENGULFING: {
        name: 'Engolfo de Alta',
        type: 'Bullish',
        description: 'Um pequeno candle de baixa seguido por um candle de alta maior que o envolve completamente. Sugere uma forte reversão para cima.',
        logic: (candles: Candle[]) => {
            if (candles.length < 2) return false;
            const prev = candles[candles.length - 2];
            const curr = candles[candles.length - 1];
            return isBearish(prev) && isBullish(curr) && curr.open < prev.close && curr.close > prev.open;
        }
    },
    BEARISH_ENGULFING: {
        name: 'Engolfo de Baixa',
        type: 'Bearish',
        description: 'Um pequeno candle de alta seguido por um candle de baixa maior que o envolve completamente. Sugere uma forte reversão para baixo.',
        logic: (candles: Candle[]) => {
            if (candles.length < 2) return false;
            const prev = candles[candles.length - 2];
            const curr = candles[candles.length - 1];
            return isBullish(prev) && isBearish(curr) && curr.open > prev.close && curr.close < prev.open;
        }
    },
    HAMMER: {
        name: 'Martelo',
        type: 'Bullish',
        description: 'Ocorre após uma tendência de baixa. Tem corpo pequeno e pavio inferior longo, indicando que os compradores elevaram o preço. Sinaliza um fundo potencial.',
        logic: (candles: Candle[]) => {
            if (candles.length < 1) return false;
            const c = candles[candles.length - 1];
            return body(c) > 0 && lowerWick(c) > body(c) * 2 && upperWick(c) < body(c) * 0.5;
        }
    },
    SHOOTING_STAR: {
        name: 'Estrela Cadente',
        type: 'Bearish',
        description: 'Ocorre após uma tendência de alta. Tem corpo pequeno e pavio superior longo, indicando pressão vendedora. Sinaliza um topo potencial.',
        logic: (candles: Candle[]) => {
            if (candles.length < 1) return false;
            const c = candles[candles.length - 1];
            return body(c) > 0 && upperWick(c) > body(c) * 2 && lowerWick(c) < body(c) * 0.5;
        }
    },
    DOJI: {
        name: 'Doji',
        type: 'Indecision',
        description: 'Um candle onde os preços de abertura e fechamento são praticamente iguais. Significa indecisão no mercado, aparecendo frequentemente em pontos de virada.',
        logic: (candles: Candle[]) => {
            if (candles.length < 1) return false;
            const c = candles[candles.length - 1];
            const totalRange = c.high - c.low;
            return totalRange > 0 && body(c) / totalRange < 0.1;
        }
    },
    MORNING_STAR: {
        name: 'Estrela da Manhã',
        type: 'Bullish',
        description: 'Padrão de três candles sinalizando reversão de alta após uma baixa. Um longo candle de baixa, um pequeno (ou Doji), e um longo candle de alta.',
        logic: (candles: Candle[]) => {
            if (candles.length < 3) return false;
            const c1 = candles[candles.length - 3];
            const c2 = candles[candles.length - 2];
            const c3 = candles[candles.length - 1];
            return isBearish(c1) && body(c1) / (c1.high - c1.low) > 0.7 &&
                   body(c2) < body(c1) * 0.3 &&
                   isBullish(c3) && c3.close > c1.open;
        }
    },
    EVENING_STAR: {
        name: 'Estrela da Noite',
        type: 'Bearish',
        description: 'Padrão de três candles sinalizando reversão de baixa após uma alta. Um longo candle de alta, um pequeno (ou Doji), e um longo candle de baixa.',
        logic: (candles: Candle[]) => {
            if (candles.length < 3) return false;
            const c1 = candles[candles.length - 3];
            const c2 = candles[candles.length - 2];
            const c3 = candles[candles.length - 1];
            return isBullish(c1) && body(c1) / (c1.high - c1.low) > 0.7 &&
                   body(c2) < body(c1) * 0.3 &&
                   isBearish(c3) && c3.close < c1.open;
        }
    },
};

export const TRADING_DIRECTIONS = {
    CALL: TradingDirection.CALL,
    PUT: TradingDirection.PUT,
    NEUTRAL: TradingDirection.NEUTRAL,
};