import React from 'react';
import { BookOpen, Target, TrendingUp } from 'lucide-react';

const iconMap = {
  book: BookOpen,
  target: Target,
  trend: TrendingUp,
};

const gradientClasses = [
  'bg-gradient-to-br from-blue-900/20 to-transparent',
  'bg-gradient-to-br from-amber-900/20 to-transparent',
  'bg-gradient-to-br from-emerald-900/20 to-transparent',
];

export default function Methodology({ data }) {

  return (
    <div id="methodology" className="py-24 bg-slate-950 relative border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{data.heading}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.pillars.map((pillar, idx) => {
            const PillarIcon = iconMap[pillar.icon] || BookOpen;

            return (
              <div key={`${pillar.title}-${idx}`} className={`p-8 rounded-2xl border border-white/10 ${gradientClasses[idx % gradientClasses.length]} hover:border-amber-500/50 transition-all duration-300 group`}>
              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PillarIcon className="text-amber-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
              <p className="text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
