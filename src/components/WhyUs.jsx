import React from 'react';
import { Zap, Target, Users, ShieldCheck } from 'lucide-react';

const iconMap = {
  zap: Zap,
  target: Target,
  users: Users,
  shield: ShieldCheck,
};

export default function WhyUs({ data }) {

  return (
    <div id="why-us" className="py-24 bg-slate-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{data.heading}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">{data.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.cards.map((item, i) => {
            const ReasonIcon = iconMap[item.icon] || Zap;

            return (
            <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <ReasonIcon size={24} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
