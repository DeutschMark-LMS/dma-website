import React from 'react';

export default function Footer({ data }) {
  return (
    <footer id="footer" className="bg-slate-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xl">
                D
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Deutsch Mark Academy
              </span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              {data.about}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              {data.quickLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a href={link.href} className="hover:text-amber-400 transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400">
              {data.legalLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a href={link.href} className="hover:text-amber-400 transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Deutsch Mark Academy. All rights reserved.</p>
          <p className="mt-2 md:mt-0">{data.bottomLine}</p>
        </div>
      </div>
    </footer>
  );
}
