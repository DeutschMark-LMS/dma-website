import React from 'react';
import { Zap, ChevronRight, PlayCircle } from 'lucide-react';

export default function Hero({ data }) {
  const secondaryButton = data.secondaryButton || {
    enabled: false,
    label: 'Join Free Challenge',
    href: '#why-us',
  };

  return (
    <div id="hero" className="relative pt-20 pb-14 sm:pt-24 sm:pb-16 lg:pt-40 lg:pb-28 overflow-hidden border-b border-white/5">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
          <Zap size={16} />
          <span>{data.badgeText}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-5 sm:mb-6">
          {data.titleMain} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
            {data.titleHighlight}
          </span>
        </h1>
        
        <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-8 sm:mb-10">
          {data.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href={data.primaryButton.href} className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            {data.primaryButton.label} <ChevronRight size={20} />
          </a>
          {secondaryButton.enabled && (
            <a href={secondaryButton.href} className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
              <PlayCircle size={20} className="text-amber-400" /> {secondaryButton.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
