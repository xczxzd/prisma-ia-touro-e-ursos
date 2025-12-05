
import React from 'react';
import { Signal, TradingDirection } from '../types';

interface SignalDisplayProps {
    signal: Signal | null;
    isAnalyzing?: boolean;
}

const SignalDisplay: React.FC<SignalDisplayProps> = ({ signal, isAnalyzing }) => {
    if (isAnalyzing) {
         return (
            <div className="bg-dark-secondary/80 backdrop-blur-md rounded-2xl border border-neon-purple/30 p-8 flex flex-col items-center justify-center h-full relative overflow-hidden shadow-neon-purple/20">
                <div className="absolute inset-0 bg-neon-purple/5 animate-pulse"></div>
                
                {/* Loader Moderno */}
                <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-neon-purple/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-neon-purple rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-transparent border-b-neon-pink rounded-full animate-spin [animation-duration:1.5s]"></div>
                </div>

                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink mb-2 z-10 animate-pulse">
                    ANALISANDO
                </h2>
                <p className="text-gray-400 text-sm tracking-wide z-10 font-mono">Decodificando algoritmo...</p>
            </div>
        );
    }

    if (!signal) {
        return (
            <div className="bg-dark-secondary/60 backdrop-blur-md rounded-2xl border border-white/5 p-8 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-700 animate-[spin_10s_linear_infinite] mb-4"></div>
                <h2 className="text-xl font-bold text-gray-500 mb-2">Aguardando</h2>
                <p className="text-gray-600 text-sm">Sistema em espera...</p>
            </div>
        );
    }
    
    const isCall = signal.direction === TradingDirection.CALL;
    const isNeutral = signal.direction === TradingDirection.NEUTRAL;
    
    // Configurações de cores baseadas no sinal
    let accentColor = isCall ? 'text-brand-call' : 'text-brand-put';
    let glowClass = isCall ? 'shadow-neon-green' : 'shadow-neon-red';
    let borderColor = isCall ? 'border-brand-call/50' : 'border-brand-put/50';
    let bgGradient = isCall 
        ? 'bg-gradient-to-br from-brand-call/10 to-transparent' 
        : 'bg-gradient-to-br from-brand-put/10 to-transparent';

    if (isNeutral) {
        accentColor = 'text-yellow-400';
        glowClass = 'shadow-lg shadow-yellow-500/20';
        borderColor = 'border-yellow-500/50';
        bgGradient = 'bg-gradient-to-br from-yellow-500/10 to-transparent';
    }

    const sourceLabel = signal.source === 'ai' ? 'PRISMA AI' : 'ALGORITMO';

    return (
        <div className={`rounded-2xl border ${borderColor} ${bgGradient} p-6 flex flex-col justify-between h-full relative overflow-hidden transition-all duration-500 hover:scale-[1.02]`}>
            {/* Background Glow Elements */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 ${isCall ? 'bg-brand-call' : isNeutral ? 'bg-yellow-500' : 'bg-brand-put'}`}></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sinal Detectado</h2>
                    <span className={`text-[10px] font-black px-2 py-1 rounded bg-black/50 border border-white/10 ${signal.source === 'ai' ? 'text-neon-purple border-neon-purple/50 shadow-neon-purple' : 'text-gray-400'}`}>
                        {sourceLabel}
                    </span>
                </div>
                
                <div className={`text-6xl md:text-7xl font-black ${accentColor} tracking-tight drop-shadow-lg`}>
                    {isNeutral ? 'NEUTRO' : signal.direction}
                </div>
                
                {signal.entryTime && (
                     <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        <p className="text-sm font-bold text-white tracking-wide">
                            ENTRADA: <span className={accentColor}>{signal.entryTime.toUpperCase()}</span>
                        </p>
                     </div>
                )}
            </div>
            
            <div className="relative z-10 mt-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs text-gray-400 font-mono">CONFIANÇA</span>
                    <span className={`text-3xl font-black ${accentColor}`}>
                        {signal.confidence}%
                    </span>
                </div>
                {/* Barra de Progresso Customizada */}
                <div className="w-full h-2 bg-dark-tertiary rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${isNeutral ? 'bg-yellow-400' : isCall ? 'bg-brand-call' : 'bg-brand-put'} shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`} 
                        style={{ width: `${signal.confidence}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default SignalDisplay;
