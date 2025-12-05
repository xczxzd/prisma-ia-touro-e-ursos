
import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Candle } from '../types';

interface CandlestickChartProps {
    data: Candle[];
}

const ForceChart: React.FC<CandlestickChartProps> = ({ data }) => {
    // Calcular a força de compra vs venda baseada no corpo das velas
    const chartData = useMemo(() => {
        let buyPressure = 0;
        let sellPressure = 0;

        data.forEach(candle => {
            const bodySize = Math.abs(candle.close - candle.open);
            if (candle.close >= candle.open) {
                buyPressure += bodySize;
            } else {
                sellPressure += bodySize;
            }
        });

        // Evitar divisão por zero ou gráfico vazio
        if (buyPressure === 0 && sellPressure === 0) {
            buyPressure = 50;
            sellPressure = 50;
        }

        return [
            { name: '🐂 Compradores (Touros)', value: buyPressure, color: '#00ff9d' }, // Neon Green
            { name: '🐻 Vendedores (Ursos)', value: sellPressure, color: '#ff0055' }, // Neon Red
        ];
    }, [data]);

    const totalPressure = chartData[0].value + chartData[1].value;
    const buyPercentage = Math.round((chartData[0].value / totalPressure) * 100);
    const sellPercentage = Math.round((chartData[1].value / totalPressure) * 100);
    
    // Determina quem está ganhando
    const isBullish = buyPercentage >= sellPercentage;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                                style={{
                                    filter: `drop-shadow(0 0 8px ${entry.color})`,
                                    opacity: 0.9
                                }}
                            />
                        ))}
                    </Pie>
                    <Tooltip 
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div className="bg-dark-tertiary/90 border border-white/10 p-2 rounded text-xs text-white backdrop-blur">
                                        <span style={{ color: d.color, fontWeight: 'bold' }}>{d.name}</span>
                                        : {Math.round(d.value as number).toFixed(0)} pts
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Central Info Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-center">
                    <h3 className="text-gray-400 text-[10px] md:text-xs font-mono tracking-widest uppercase mb-1">
                        DOMINÂNCIA
                    </h3>
                    <div className={`text-4xl md:text-5xl font-black ${isBullish ? 'text-brand-call drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]' : 'text-brand-put drop-shadow-[0_0_10px_rgba(255,0,85,0.5)]'}`}>
                        {isBullish ? `${buyPercentage}%` : `${sellPercentage}%`}
                    </div>
                    <div className={`text-xs md:text-sm font-bold mt-2 px-3 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-sm ${isBullish ? 'text-brand-call border-brand-call/20' : 'text-brand-put border-brand-put/20'}`}>
                        {isBullish ? '🐂 TOUROS (COMPRA)' : '🐻 URSOS (VENDA)'}
                    </div>
                </div>
            </div>
            
            {/* Legend Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-bold px-4 opacity-50">
                <div className="flex items-center gap-2 text-brand-call">
                    <div className="w-2 h-2 rounded-full bg-brand-call shadow-neon-green"></div>
                    CALL
                </div>
                <div className="flex items-center gap-2 text-brand-put">
                    PUT
                    <div className="w-2 h-2 rounded-full bg-brand-put shadow-neon-red"></div>
                </div>
            </div>
        </div>
    );
};

export default ForceChart;
