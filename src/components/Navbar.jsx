import React from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ data, isScrolled, mobileMenuOpen, setMobileMenuOpen, withTopTicker = false }) {
  const topOffsetClass = withTopTicker ? 'top-12 md:top-14' : 'top-0';

  return (
    <nav className={`fixed ${topOffsetClass} w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt={`${data.brandMain} ${data.brandAccent} logo`}
                className="w-9 h-9 rounded object-cover border border-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 font-bold text-xl">
                D
              </div>
            )}
            <span className="text-xl font-bold text-white tracking-tight">
              {data.brandMain} <span className="text-amber-400">{data.brandAccent}</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            {data.links.map((link) => (
              <a key={`${link.label}-${link.href}`} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 px-4 py-6 flex flex-col gap-4 shadow-xl">
          {data.links.map((link) => (
            <a
              key={`mobile-${link.label}-${link.href}`}
              href={link.href}
              className="text-slate-300 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
