
export interface Candle {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

export enum TradingDirection {
    CALL = "CALL",
    PUT = "PUT",
    NEUTRAL = "NEUTRAL",
}

export interface Pattern {
    name: string;
    type: 'Bullish' | 'Bearish' | 'Continuation' | 'Reversal' | 'Indecision' | 'Artificial Intelligence';
    description: string;
    logic: (candles: Candle[]) => boolean;
}

export interface Signal {
    direction: TradingDirection;
    confidence: number;
    pattern: Pattern;
    timestamp: number;
    source?: 'algo' | 'ai'; // Identifica se veio do algoritmo ou da IA
    entryTime?: string; // Ex: "Próxima Vela", "Vela Atual"
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    image?: string; // Data URL for display
}