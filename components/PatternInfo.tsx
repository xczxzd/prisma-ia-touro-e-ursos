
import React from 'react';
import { Pattern } from '../types';

interface PatternInfoProps {
    pattern: Pattern | null;
}

const PatternInfo: React.FC<PatternInfoProps> = ({ pattern }) => {
    if (!pattern) {
        return (
            <div className="bg-dark-secondary/60 backdrop-blur-md rounded-2xl border border-white/5 p-8 flex flex-col items-center justify-center text-center h-full">
                <h2 className="text-lg font-bold text-gray-500">Scanner Ativo</h2>
                <p className="text-xs text-gray-600 mt-2 font-mono">RASTREADOR DE PADRÕES LIGADO</p>
            </div>
        );
    }

    let typeColor = '';
    let typeDisplay = '';

    switch(pattern.type) {
        case 'Bullish':
            typeDisplay = 'ALTA';
            typeColor = 'text-brand-call drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]';
            break;
        case 'Bearish':
            typeDisplay = 'BAIXA';
            typeColor = 'text-brand-put drop-shadow-[0_0_5px_rgba(255,0,85,0.5)]';
            break;
        case 'Indecision':
            typeDisplay = 'INDECISÃO';
            typeColor = 'text-yellow-400';
            break;
        case 'Artificial Intelligence':
            typeDisplay = 'IA ANALYTICS';
            typeColor = 'text-neon-purple drop-shadow-[0_0_5px_rgba(176,38,255,0.5)]';
            break;
        default:
            typeDisplay = pattern.type.toUpperCase();
            typeColor = 'text-gray-400';
    }

    return (
        <div className="bg-dark-secondary/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Decorative Line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white/20 to-transparent"></div>
            
            <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Gatilho Identificado</h2>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                    {pattern.name}
                </h3>
                <div className={`text-sm font-bold tracking-widest ${typeColor} border border-white/5 bg-black/20 inline-block px-3 py-1 rounded-md`}>
                    {typeDisplay}
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                    {pattern.description}
                </p>
            </div>
        </div>
    );
};

export default PatternInfo;
