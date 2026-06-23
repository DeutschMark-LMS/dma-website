import React from 'react';

export default function CTA({ data }) {
  return (
    <div id="cta" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-900" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{data.heading}</h2>
        <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto">
          {data.description}
        </p>
        <a href={data.button.href} className="inline-flex px-10 py-5 text-lg font-bold bg-slate-950 text-white rounded-xl hover:bg-slate-900 hover:scale-105 transition-all duration-300 shadow-2xl border border-slate-800">
          {data.button.label}
        </a>
      </div>
    </div>
  );
}
