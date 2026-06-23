import React from 'react';

const defaultTicker = {
  enabled: true,
  leftTag: 'Limited Time',
  message: 'Ongoing Offer: Enroll now and get bonus implementation sessions this week only.',
  ctaLabel: 'Claim Offer',
  ctaHref: '#programs',
  rightTag: 'Ends Soon',
  speed: 26,
};

export default function PromoTicker({ data, fixedTop = false }) {
  const ticker = { ...defaultTicker, ...(data || {}) };

  if (!ticker.enabled) {
    return null;
  }

  const speed = Number.isFinite(Number(ticker.speed)) ? Number(ticker.speed) : defaultTicker.speed;
  const duration = Math.min(80, Math.max(8, speed));
  const positioningClass = fixedTop ? 'fixed top-0 left-0 right-0 z-[60]' : '';
  const leftTag = ticker.leftTag ?? defaultTicker.leftTag;
  const rightTag = ticker.rightTag ?? defaultTicker.rightTag;

  return (
    <section
      id="promo-ticker"
      className={`${positioningClass} border-y border-amber-400/25 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 overflow-hidden`}
    >
      <div
        className="promo-marquee-track flex w-max min-w-full items-center"
        style={{ '--marquee-duration': `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-4 px-3 py-1.5 whitespace-nowrap">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.12em]">{leftTag}</span>
            <span className="text-xs sm:text-sm font-semibold">{ticker.message}</span>
            {ticker.ctaLabel && ticker.ctaHref && (
              <a
                href={ticker.ctaHref}
                className="text-[10px] sm:text-xs font-black uppercase tracking-wide rounded-full border border-slate-900/70 px-2.5 py-0.5 hover:bg-slate-900 hover:text-amber-300 transition-colors"
              >
                {ticker.ctaLabel}
              </a>
            )}
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.12em]">{rightTag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
