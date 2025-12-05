
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-dark-secondary/80 backdrop-blur-md border-b border-white/5 p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-center items-center relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-neon-purple rounded-full shadow-neon-purple animate-pulse hidden md:block"></div>
                
                <h1 className="text-3xl md:text-4xl font-black tracking-widest uppercase">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-purple via-white to-neon-pink drop-shadow-[0_0_10px_rgba(176,38,255,0.5)]">
                        PRISMA AI
                    </span>
                </h1>
                
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-neon-pink rounded-full shadow-neon-pink animate-pulse hidden md:block"></div>
            </div>
        </header>
    );
};

export default Header;
