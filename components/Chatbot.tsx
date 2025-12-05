
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Signal, TradingDirection } from '../types';
import { getChatResponse } from '../services/geminiService';
import { AI_PATTERN } from '../constants';

// Ícones atualizados e estilizados
const BotIcon = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink p-[2px] shadow-neon-purple">
        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path fillRule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a.75.75 0 0 0 0 1.5h6.75a.75.75 0 0 0 0-1.5h-6.75Zm0 3.75a.75.75 0 0 0 0 1.5h6.75a.75.75 0 0 0 0-1.5h-6.75Zm0 3.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z" clipRule="evenodd" />
            </svg>
        </div>
    </div>
);

const UserIcon = () => (
    <div className="w-10 h-10 rounded-full bg-dark-tertiary border border-white/10 flex items-center justify-center shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
        </svg>
    </div>
);

const ClipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z" clipRule="evenodd" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
    </svg>
);

interface ChatbotProps {
    onAnalysisStart?: () => void;
    onAnalysisEnd?: () => void;
    onSignalDetected?: (signal: Signal) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onAnalysisStart, onAnalysisEnd, onSignalDetected }) => {
    const initialMessage: ChatMessage = { 
        sender: 'bot', 
        text: 'PRISMA DECODER V2.1 online. Sistemas de rastreio de manipulação ativados. Envie o print do gráfico.' 
    };

    const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string, previewUrl: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleClearChat = () => {
        if (window.confirm('Limpar histórico visual?')) {
            setMessages([initialMessage]);
        }
    };

    const processImageFile = (blob: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const mimeMatch = base64String.match(/^data:(.*);base64,/);
            const detectedMimeType = mimeMatch ? mimeMatch[1] : (blob.type || 'image/png');
            const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
            const cleanBase64Data = base64Data.replace(/\s/g, '');

            setSelectedImage({
                data: cleanBase64Data,
                mimeType: detectedMimeType,
                previewUrl: base64String
            });
        };
        reader.readAsDataURL(blob);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    processImageFile(blob);
                    e.preventDefault(); 
                }
                break;
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processImageFile(file);
        }
    };

    const processBotResponseForSignal = (text: string) => {
        if (!onSignalDetected) return;

        const upperText = text.toUpperCase();
        let direction: TradingDirection | null = null;
        let entryTime = "";

        if (upperText.includes("COMPRA") || upperText.includes("CALL") || upperText.includes("🟢")) {
            direction = TradingDirection.CALL;
        } else if (upperText.includes("VENDA") || upperText.includes("PUT") || upperText.includes("🔴")) {
            direction = TradingDirection.PUT;
        } else if (upperText.includes("NÃO ENTRAR") || upperText.includes("AGUARDAR") || upperText.includes("NEUTRO") || upperText.includes("🟡")) {
            direction = TradingDirection.NEUTRAL;
        }

        if (upperText.includes("PRÓXIMA VELA") || upperText.includes("PROXIMA VELA")) {
            entryTime = "Próxima Vela";
        } else if (upperText.includes("VELA ATUAL") || upperText.includes("MESMA VELA")) {
            entryTime = "Vela Atual";
        } else if (upperText.includes("FECHAMENTO")) {
             entryTime = "Fechamento";
        }

        if (direction) {
            onSignalDetected({
                direction: direction,
                confidence: direction === TradingDirection.NEUTRAL ? 0 : 95,
                pattern: AI_PATTERN,
                timestamp: Date.now(),
                source: 'ai',
                entryTime: entryTime
            });
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((inputValue.trim() === '' && !selectedImage) || isLoading) return;

        const userText = inputValue;
        const currentImage = selectedImage;

        setInputValue('');
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        setIsLoading(true);
        if (onAnalysisStart) onAnalysisStart();

        const userMessage: ChatMessage = { 
            sender: 'user', 
            text: userText,
            image: currentImage?.previewUrl
        };
        setMessages(prev => [...prev, userMessage]);

        const botResponseText = await getChatResponse(
            messages, 
            userText, 
            currentImage ? { data: currentImage.data, mimeType: currentImage.mimeType } : undefined
        );
        
        const botMessage: ChatMessage = { sender: 'bot', text: botResponseText };

        setMessages(prev => [...prev, botMessage]);
        processBotResponseForSignal(botResponseText);

        setIsLoading(false);
        if (onAnalysisEnd) onAnalysisEnd();
    };

    return (
        <div className="flex flex-col h-full bg-dark-secondary/80 backdrop-blur-xl border border-neon-purple/20 rounded-2xl shadow-neon-purple/10 overflow-hidden relative">
            {/* Header do Chat */}
            <div className="p-4 bg-gradient-to-r from-dark-tertiary to-transparent border-b border-white/5 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-neon-green"></div>
                    <h2 className="text-sm font-bold tracking-wider text-white uppercase">Prisma Bot <span className="text-neon-pink text-xs ml-1">V2.1</span></h2>
                </div>
                <button 
                    onClick={handleClearChat}
                    className="text-gray-500 hover:text-neon-pink transition-all p-2 rounded-full hover:bg-white/5"
                    title="Limpar Chat"
                >
                    <TrashIcon />
                </button>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-grow p-4 overflow-y-auto space-y-6 relative">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} relative z-10`}>
                        {msg.sender === 'bot' ? <BotIcon /> : <UserIcon />}
                        
                        <div className={`flex flex-col gap-2 max-w-[85%]`}>
                            {msg.image && (
                                <div className={`p-1 rounded-xl border ${msg.sender === 'bot' ? 'border-neon-purple/30' : 'border-white/10'}`}>
                                    <img src={msg.image} alt="Upload" className="rounded-lg max-h-48 object-cover" />
                                </div>
                            )}
                            {(msg.text || !msg.image) && (
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg
                                    ${msg.sender === 'bot' 
                                        ? 'bg-gradient-to-br from-[#2d1b4e] to-[#1a0f2e] border border-neon-purple/30 text-gray-100 rounded-tl-none' 
                                        : 'bg-dark-tertiary border border-white/5 text-gray-300 rounded-tr-none'
                                    }`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <BotIcon />
                        <div className="p-4 rounded-2xl rounded-tl-none bg-dark-tertiary border border-neon-purple/20">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-neon-purple rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-neon-pink rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-dark-secondary/90 border-t border-white/5 z-20">
                {selectedImage && (
                    <div className="mb-3 flex items-center gap-3 bg-dark-tertiary/50 p-2 rounded-lg border border-neon-pink/30 animate-in slide-in-from-bottom-2">
                        <div className="relative">
                            <img src={selectedImage.previewUrl} alt="Preview" className="h-16 w-auto rounded border border-white/10" />
                            <button 
                                onClick={() => {
                                    setSelectedImage(null);
                                    if(fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:scale-110 transition-transform"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <span className="text-xs text-neon-pink font-semibold">Imagem anexada</span>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden" 
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 rounded-full bg-dark-tertiary hover:bg-neon-purple/20 text-gray-400 hover:text-neon-purple transition-all duration-300"
                        title="Anexar (ou cole com Ctrl+V)"
                    >
                        <ClipIcon />
                    </button>
                    
                    <div className="flex-grow relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPaste={handlePaste}
                            placeholder="Pergunte ao Prisma AI..."
                            className="w-full bg-dark-tertiary/50 border border-white/10 text-white px-5 py-3 rounded-full focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading || (!inputValue.trim() && !selectedImage)}
                        className="p-3 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg hover:shadow-neon-purple/50 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
