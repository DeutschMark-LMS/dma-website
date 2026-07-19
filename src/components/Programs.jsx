import React from 'react';
import { ChevronRight } from 'lucide-react';
import CheckCircle from './CheckCircle';

export default function Programs({ data }) {
  return (
    <div id="programs" className="py-16 sm:py-20 lg:py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">{data.heading}</h2>
            <p className="text-slate-400 max-w-xl text-base sm:text-lg">{data.description}</p>
          </div>
          <a href={data.catalogButton.href} className="mt-6 md:mt-0 text-amber-400 font-medium hover:text-amber-300 flex items-center gap-1 transition-colors">
            {data.catalogButton.label} <ChevronRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {data.items.map((program, idx) => (
            <div key={program.id || idx} className="group bg-slate-950 rounded-2xl border border-white/10 overflow-hidden hover:border-amber-500/50 transition-all duration-500 flex flex-col h-full">
              <div className="h-52 relative p-6 flex items-end overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                {program.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/20 rounded-full text-xs font-bold tracking-wide uppercase">
                    {program.badge}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white relative z-10">{program.title}</h3>
              </div>
              <div className="p-5 sm:p-8 flex flex-col flex-grow">
                <p className="text-amber-400 font-medium mb-4">
                  {program.subtitle}
                </p>
                <p className="text-slate-300 mb-6 line-clamp-3">
                  {program.description}
                </p>
                <ul className="space-y-3 text-slate-400 text-sm mb-8 flex-grow">
                  {(program.features || []).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle /> {feature}
                    </li>
                  ))}
                </ul>
                <a href={program.button.href} className="w-full py-4 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all duration-300 flex justify-center items-center gap-2">
                  {program.button.label} <ChevronRight size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
