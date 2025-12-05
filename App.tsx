
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CandlestickChart from './components/CandlestickChart';
import SignalDisplay from './components/SignalDisplay';
import PatternInfo from './components/PatternInfo';
import Chatbot from './components/Chatbot';
import { useCandleData } from './hooks/useCandleData';
import { analisarCandles } from './services/tradingAnalysisService';
import { Candle, Signal, Pattern } from './types';
import { CANDLESTICK_PATTERNS } from './constants';

const App: React.FC = () => {
    const candles = useCandleData(50);
    const [latestSignal, setLatestSignal] = useState<Signal | null>(null);
    const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

    const runAnalysis = useCallback(() => {
        if (candles.length > 5 && !isAiAnalyzing) {
            const result = analisarCandles(candles);
            if (result) {
                const isRecentAiSignal = latestSignal?.source === 'ai' && (Date.now() - latestSignal.timestamp < 30000);

                if (!isRecentAiSignal) {
                     if (!latestSignal || result.pattern.name !== latestSignal.pattern.name || result.timestamp !== latestSignal.timestamp) {
                        setLatestSignal({ ...result, source: 'algo' });
                    }
                }
            }
        }
    }, [candles, latestSignal, isAiAnalyzing]);

    useEffect(() => {
        runAnalysis();
    }, [candles, runAnalysis]);

    const handleAiSignal = (signal: Signal) => {
        setLatestSignal(signal);
    };

    const allPatterns: Pattern[] = Object.values(CANDLESTICK_PATTERNS);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow p-4 md:p-6 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Chart & Signals (8/12 width on large screens) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Chart Section */}
                    <div className="bg-dark-secondary/60 backdrop-blur-sm border border-white/5 rounded-2xl shadow-lg p-1 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent pointer-events-none"></div>
                        <div className="h-96 w-full relative z-10">
                            <CandlestickChart data={candles} />
                        </div>
                    </div>
                    
                    {/* Signal & Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SignalDisplay signal={latestSignal} isAnalyzing={isAiAnalyzing} />
                        <PatternInfo pattern={latestSignal?.pattern ?? null} />
                    </div>
                </div>

                {/* Right Column: Chatbot (4/12 width on large screens) */}
                <div className="lg:col-span-4 h-[600px] lg:h-auto">
                    <Chatbot 
                        onAnalysisStart={() => setIsAiAnalyzing(true)}
                        onAnalysisEnd={() => setIsAiAnalyzing(false)}
                        onSignalDetected={handleAiSignal}
                    />
                </div>
            </main>

            <footer className="p-6 border-t border-white/5 bg-dark-secondary/50 backdrop-blur text-center mt-auto">
                <h3 className="text-sm font-bold mb-4 text-gray-400 uppercase tracking-widest">
                    Padrões Rastreados
                </h3>
                <div className="flex flex-wrap justify-center gap-3 text-xs">
                    {allPatterns.map(p => (
                        <div key={p.name} className="px-3 py-1.5 bg-dark-tertiary/50 border border-white/5 rounded-full text-gray-400 hover:text-neon-purple hover:border-neon-purple/50 transition-all cursor-default">
                            {p.name}
                        </div>
                    ))}
                </div>
                <p className="mt-6 text-[10px] text-gray-600">
                    &copy; 2025 PRISMA AI. O trading envolve riscos.
                </p>
            </footer>
        </div>
    );
};

export default App;
