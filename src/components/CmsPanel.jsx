import React, { useState } from 'react';

function Field({ label, value, onChange, placeholder = '', multiline = false }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[90px] rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
        />
      )}
    </label>
  );
}

function SectionCard({ id, title, subtitle, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section id={id} className="rounded-2xl border border-slate-700/80 bg-slate-900/70 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/70 hover:from-slate-800 hover:to-slate-700 transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <span className="text-slate-300 text-sm">{isOpen ? 'Hide' : 'Edit'}</span>
        </div>
      </button>
      {isOpen && <div className="p-5">{children}</div>}
    </section>
  );
}

function LinkEditor({ links, onChange }) {
  return (
    <div className="space-y-3">
      {links.map((link, idx) => (
        <div key={`${link.label}-${idx}`} className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg border border-slate-700 p-3">
          <Field
            label={`Link ${idx + 1} Label`}
            value={link.label}
            onChange={(value) => {
              const next = [...links];
              next[idx] = { ...next[idx], label: value };
              onChange(next);
            }}
          />
          <Field
            label={`Link ${idx + 1} URL`}
            value={link.href}
            onChange={(value) => {
              const next = [...links];
              next[idx] = { ...next[idx], href: value };
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(links.filter((_, i) => i !== idx))}
            className="md:col-span-2 text-sm rounded-md border border-red-500/40 text-red-300 px-3 py-2 hover:bg-red-500/10"
          >
            Remove Link
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...links, { label: 'New Link', href: '#' }])}
        className="text-sm rounded-md border border-emerald-500/40 text-emerald-300 px-3 py-2 hover:bg-emerald-500/10"
      >
        Add Link
      </button>
    </div>
  );
}

export default function CmsPanel({ content, setContent, resetContent, syncNow, syncStatus, isCloudEnabled, onLogout }) {
  const [saveFeedback, setSaveFeedback] = useState({ state: 'idle', at: '' });
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [previewSection, setPreviewSection] = useState('all');
  const [previewKey, setPreviewKey] = useState(0);
  const [inlineHeroEdit, setInlineHeroEdit] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  const heroSecondaryButton = content.hero.secondaryButton || {
    enabled: false,
    label: 'Join Free Challenge',
    href: '#why-us',
  };

  const promoTickerDefaults = {
    enabled: true,
    leftTag: 'Limited Time',
    message: 'Ongoing Offer: Enroll now and get bonus implementation sessions this week only.',
    ctaLabel: 'Claim Offer',
    ctaHref: '#programs',
    rightTag: 'Ends Soon',
    speed: 26,
  };

  const promoTicker = {
    ...promoTickerDefaults,
    ...(content.promoTicker || {}),
  };

  const handleSaveNow = async () => {
    setSaveFeedback({ state: 'saving', at: '' });
    const ok = await syncNow();

    if (ok) {
      const at = new Date().toLocaleTimeString();
      setSaveFeedback({ state: 'saved', at });
      window.setTimeout(() => {
        setSaveFeedback((prev) => (prev.state === 'saved' ? { state: 'idle', at: prev.at } : prev));
      }, 2200);
      return;
    }

    setSaveFeedback({ state: 'error', at: '' });
  };

  const updateSection = (section, updater) => {
    setContent((prev) => ({
      ...prev,
      [section]: updater(prev[section]),
    }));
  };

  const moveProgram = (fromIndex, toIndex) => {
    updateSection('programs', (section) => {
      if (toIndex < 0 || toIndex >= section.items.length) {
        return section;
      }

      const items = [...section.items];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return { ...section, items };
    });
  };

  const jumpToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const previewFrameClass =
    previewDevice === 'mobile'
      ? 'w-[390px] max-w-full h-[780px]'
      : previewDevice === 'tablet'
        ? 'w-[820px] max-w-full h-[840px]'
        : 'w-full h-[840px]';

  const previewSectionOptions = [
    { id: 'all', label: 'All' },
    { id: 'ticker', label: 'Ticker' },
    { id: 'hero', label: 'Hero' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'programs', label: 'Programs' },
    { id: 'why-us', label: 'Why Us' },
    { id: 'cta', label: 'CTA' },
    { id: 'footer', label: 'Footer' },
  ];

  const previewSrc =
    previewSection === 'all'
      ? '/'
      : `/?previewSection=${encodeURIComponent(previewSection)}`;

  const sections = [
    { id: 'cms-navbar', label: 'Navbar' },
    { id: 'cms-ticker', label: 'Ticker' },
    { id: 'cms-hero', label: 'Hero' },
    { id: 'cms-methodology', label: 'Methodology' },
    { id: 'cms-programs', label: 'Programs' },
    { id: 'cms-whyus', label: 'Why Us' },
    { id: 'cms-cta', label: 'CTA' },
    { id: 'cms-footer', label: 'Footer' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#081225] to-slate-950 text-slate-100">
      <div className="sticky top-0 z-20 border-b border-slate-700/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Content Studio</h1>
            <p className="text-slate-400 text-sm">Visual CMS workspace for live website content editing.</p>
            <p className="text-xs text-slate-500 mt-1">{syncStatus}</p>
            {saveFeedback.state === 'saved' && <p className="text-xs text-emerald-400 mt-1">Saved successfully at {saveFeedback.at}</p>}
            {saveFeedback.state === 'error' && <p className="text-xs text-red-400 mt-1">Save failed. Please try again.</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/" className="rounded-lg bg-amber-500 text-slate-900 px-4 py-2 font-semibold">Open Public Site</a>
            <button
              type="button"
              onClick={handleSaveNow}
              disabled={saveFeedback.state === 'saving'}
              className="rounded-lg border border-emerald-500/40 text-emerald-300 px-4 py-2 font-semibold hover:bg-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saveFeedback.state === 'saving'
                ? 'Saving...'
                : saveFeedback.state === 'saved'
                  ? 'Saved!'
                  : saveFeedback.state === 'error'
                    ? 'Retry Save'
                    : isCloudEnabled
                      ? 'Save Now (Cloud)'
                      : 'Save Now'}
            </button>
            <button
              type="button"
              onClick={resetContent}
              className="rounded-lg border border-red-500/40 text-red-300 px-4 py-2 font-semibold hover:bg-red-500/10"
            >
              Reset All
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-slate-500/40 text-slate-300 px-4 py-2 font-semibold hover:bg-slate-500/10"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => jumpToSection(section.id)}
              className="text-xs rounded-full border border-slate-600 bg-slate-900/60 px-3 py-1.5 text-slate-200 hover:border-amber-400/60 hover:text-amber-300"
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="grid xl:grid-cols-[minmax(0,1fr)_560px] gap-6 items-start">
          <div className="space-y-4">
            <SectionCard id="cms-navbar" title="Navbar" subtitle="Brand, logo, navigation links" defaultOpen>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Brand Main" value={content.navbar.brandMain} onChange={(value) => updateSection('navbar', (s) => ({ ...s, brandMain: value }))} />
            <Field label="Brand Accent" value={content.navbar.brandAccent} onChange={(value) => updateSection('navbar', (s) => ({ ...s, brandAccent: value }))} />
          </div>
          <Field
            label="Logo Image URL (optional)"
            value={content.navbar.logoUrl || ''}
            onChange={(value) => updateSection('navbar', (s) => ({ ...s, logoUrl: value }))}
            placeholder="https://yourdomain.com/logo.png"
          />
          <LinkEditor links={content.navbar.links} onChange={(links) => updateSection('navbar', (s) => ({ ...s, links }))} />
            </SectionCard>

            <SectionCard id="cms-ticker" title="Promo Ticker" subtitle="Moving announcement/offer strip">
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={Boolean(promoTicker.enabled)}
              onChange={(e) =>
                updateSection('promoTicker', (s) => ({
                  ...(s || promoTicker),
                  enabled: e.target.checked,
                }))
              }
            />
            <span className="text-sm text-slate-200">Enable Promo Ticker</span>
          </label>
          <Field
            label="Ticker Message"
            value={promoTicker.message || ''}
            onChange={(value) =>
              updateSection('promoTicker', (s) => ({
                ...(s || promoTicker),
                message: value,
              }))
            }
            placeholder="Limited-time offer message"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Left Tag"
              value={promoTicker.leftTag || ''}
              onChange={(value) =>
                updateSection('promoTicker', (s) => ({
                  ...(s || promoTicker),
                  leftTag: value,
                }))
              }
              placeholder="Limited Time"
            />
            <Field
              label="Right Tag"
              value={promoTicker.rightTag || ''}
              onChange={(value) =>
                updateSection('promoTicker', (s) => ({
                  ...(s || promoTicker),
                  rightTag: value,
                }))
              }
              placeholder="Ends Soon"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="CTA Label"
              value={promoTicker.ctaLabel || ''}
              onChange={(value) =>
                updateSection('promoTicker', (s) => ({
                  ...(s || promoTicker),
                  ctaLabel: value,
                }))
              }
            />
            <Field
              label="CTA URL"
              value={promoTicker.ctaHref || ''}
              onChange={(value) =>
                updateSection('promoTicker', (s) => ({
                  ...(s || promoTicker),
                  ctaHref: value,
                }))
              }
            />
          </div>
          <Field
            label="Scroll Speed (seconds, lower = faster)"
            value={String(promoTicker.speed ?? 26)}
            onChange={(value) =>
              updateSection('promoTicker', (s) => ({
                ...(s || promoTicker),
                speed: Number(value) || 26,
              }))
            }
            placeholder="26"
          />
            </SectionCard>

            <SectionCard id="cms-hero" title="Hero Section" subtitle="Headline and primary above-the-fold CTAs" defaultOpen>
          <Field label="Badge Text" value={content.hero.badgeText} onChange={(value) => updateSection('hero', (s) => ({ ...s, badgeText: value }))} />
          <Field label="Title Main" value={content.hero.titleMain} onChange={(value) => updateSection('hero', (s) => ({ ...s, titleMain: value }))} />
          <Field label="Title Highlight" value={content.hero.titleHighlight} onChange={(value) => updateSection('hero', (s) => ({ ...s, titleHighlight: value }))} />
          <Field multiline label="Description" value={content.hero.description} onChange={(value) => updateSection('hero', (s) => ({ ...s, description: value }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Primary Button Label" value={content.hero.primaryButton.label} onChange={(value) => updateSection('hero', (s) => ({ ...s, primaryButton: { ...s.primaryButton, label: value } }))} />
            <Field label="Primary Button URL" value={content.hero.primaryButton.href} onChange={(value) => updateSection('hero', (s) => ({ ...s, primaryButton: { ...s.primaryButton, href: value } }))} />
          </div>
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={Boolean(heroSecondaryButton.enabled)}
              onChange={(e) =>
                updateSection('hero', (s) => ({
                  ...s,
                  secondaryButton: {
                    ...heroSecondaryButton,
                    enabled: e.target.checked,
                  },
                }))
              }
            />
            <span className="text-sm text-slate-200">Enable Secondary Hero Button</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Secondary Button Label"
              value={heroSecondaryButton.label}
              onChange={(value) =>
                updateSection('hero', (s) => ({
                  ...s,
                  secondaryButton: {
                    ...heroSecondaryButton,
                    label: value,
                  },
                }))
              }
            />
            <Field
              label="Secondary Button URL"
              value={heroSecondaryButton.href}
              onChange={(value) =>
                updateSection('hero', (s) => ({
                  ...s,
                  secondaryButton: {
                    ...heroSecondaryButton,
                    href: value,
                  },
                }))
              }
            />
          </div>
            </SectionCard>

            <SectionCard id="cms-methodology" title="Methodology Section" subtitle="Learn, Apply, Earn blocks">
          <Field label="Heading" value={content.methodology.heading} onChange={(value) => updateSection('methodology', (s) => ({ ...s, heading: value }))} />
          <Field multiline label="Description" value={content.methodology.description} onChange={(value) => updateSection('methodology', (s) => ({ ...s, description: value }))} />
          <div className="space-y-3">
            {content.methodology.pillars.map((pillar, idx) => (
              <div key={`${pillar.title}-${idx}`} className="rounded-lg border border-slate-700 p-3">
                <Field label={`Pillar ${idx + 1} Title`} value={pillar.title} onChange={(value) => updateSection('methodology', (s) => {
                  const pillars = [...s.pillars];
                  pillars[idx] = { ...pillars[idx], title: value };
                  return { ...s, pillars };
                })} />
                <Field multiline label={`Pillar ${idx + 1} Description`} value={pillar.desc} onChange={(value) => updateSection('methodology', (s) => {
                  const pillars = [...s.pillars];
                  pillars[idx] = { ...pillars[idx], desc: value };
                  return { ...s, pillars };
                })} />
                <Field label={`Pillar ${idx + 1} Icon (book|target|trend)`} value={pillar.icon} onChange={(value) => updateSection('methodology', (s) => {
                  const pillars = [...s.pillars];
                  pillars[idx] = { ...pillars[idx], icon: value };
                  return { ...s, pillars };
                })} />
                <button
                  type="button"
                  onClick={() => updateSection('methodology', (s) => ({ ...s, pillars: s.pillars.filter((_, i) => i !== idx) }))}
                  className="text-sm rounded-md border border-red-500/40 text-red-300 px-3 py-2 hover:bg-red-500/10"
                >
                  Remove Pillar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => updateSection('methodology', (s) => ({
                ...s,
                pillars: [...s.pillars, { title: 'New Pillar', desc: 'Describe this pillar.', icon: 'book' }],
              }))}
              className="text-sm rounded-md border border-emerald-500/40 text-emerald-300 px-3 py-2 hover:bg-emerald-500/10"
            >
              Add Pillar
            </button>
          </div>
            </SectionCard>

            <SectionCard id="cms-programs" title="Featured Programs" subtitle="Repeatable cards with images and CTA links">
          <Field label="Section Heading" value={content.programs.heading} onChange={(value) => updateSection('programs', (s) => ({ ...s, heading: value }))} />
          <Field multiline label="Section Description" value={content.programs.description} onChange={(value) => updateSection('programs', (s) => ({ ...s, description: value }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Catalog Button Label" value={content.programs.catalogButton.label} onChange={(value) => updateSection('programs', (s) => ({ ...s, catalogButton: { ...s.catalogButton, label: value } }))} />
            <Field label="Catalog Button URL" value={content.programs.catalogButton.href} onChange={(value) => updateSection('programs', (s) => ({ ...s, catalogButton: { ...s.catalogButton, href: value } }))} />
          </div>

          <div className="space-y-4 mt-4">
            {content.programs.items.map((item, idx) => (
              <div key={item.id || idx} className="rounded-lg border border-slate-700 p-3">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs rounded-full border border-slate-600 px-2 py-1 text-slate-300">Program {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => moveProgram(idx, idx - 1)}
                    disabled={idx === 0}
                    className="text-xs rounded-md border border-slate-600 px-2 py-1 text-slate-300 hover:border-amber-400/60 hover:text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Move Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveProgram(idx, idx + 1)}
                    disabled={idx === content.programs.items.length - 1}
                    className="text-xs rounded-md border border-slate-600 px-2 py-1 text-slate-300 hover:border-amber-400/60 hover:text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Move Down
                  </button>
                </div>
                <Field label={`Program ${idx + 1} ID`} value={item.id} onChange={(value) => updateSection('programs', (s) => {
                  const items = [...s.items];
                  items[idx] = { ...items[idx], id: value };
                  return { ...s, items };
                })} />
                <Field label={`Program ${idx + 1} Title`} value={item.title} onChange={(value) => updateSection('programs', (s) => {
                  const items = [...s.items];
                  items[idx] = { ...items[idx], title: value };
                  return { ...s, items };
                })} />
                <Field label={`Program ${idx + 1} Image URL`} value={item.image} onChange={(value) => updateSection('programs', (s) => {
                  const items = [...s.items];
                  items[idx] = { ...items[idx], image: value };
                  return { ...s, items };
                })} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Badge" value={item.badge || ''} onChange={(value) => updateSection('programs', (s) => {
                    const items = [...s.items];
                    items[idx] = { ...items[idx], badge: value };
                    return { ...s, items };
                  })} />
                  <Field label="Subtitle" value={item.subtitle} onChange={(value) => updateSection('programs', (s) => {
                    const items = [...s.items];
                    items[idx] = { ...items[idx], subtitle: value };
                    return { ...s, items };
                  })} />
                </div>
                <Field multiline label="Description" value={item.description} onChange={(value) => updateSection('programs', (s) => {
                  const items = [...s.items];
                  items[idx] = { ...items[idx], description: value };
                  return { ...s, items };
                })} />
                <Field
                  multiline
                  label="Features (one per line)"
                  value={item.features.join('\n')}
                  onChange={(value) => updateSection('programs', (s) => {
                    const items = [...s.items];
                    items[idx] = {
                      ...items[idx],
                      features: value
                        .split('\n')
                        .map((line) => line.trim())
                        .filter(Boolean),
                    };
                    return { ...s, items };
                  })}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Button Label" value={item.button.label} onChange={(value) => updateSection('programs', (s) => {
                    const items = [...s.items];
                    items[idx] = { ...items[idx], button: { ...items[idx].button, label: value } };
                    return { ...s, items };
                  })} />
                  <Field label="Button URL" value={item.button.href} onChange={(value) => updateSection('programs', (s) => {
                    const items = [...s.items];
                    items[idx] = { ...items[idx], button: { ...items[idx].button, href: value } };
                    return { ...s, items };
                  })} />
                </div>
                <button
                  type="button"
                  onClick={() => updateSection('programs', (s) => ({ ...s, items: s.items.filter((_, i) => i !== idx) }))}
                  className="text-sm rounded-md border border-red-500/40 text-red-300 px-3 py-2 hover:bg-red-500/10"
                >
                  Remove Program
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => updateSection('programs', (s) => ({
              ...s,
              items: [
                ...s.items,
                {
                  id: `prog-${Date.now()}`,
                  title: 'New Program',
                  image: '',
                  badge: '',
                  subtitle: 'Subtitle',
                  description: 'Describe this program.',
                  features: ['Feature one', 'Feature two'],
                  button: { label: 'Get Started', href: '#' },
                },
              ],
            }))}
            className="mt-4 text-sm rounded-md border border-emerald-500/40 text-emerald-300 px-3 py-2 hover:bg-emerald-500/10"
          >
            Add Program
          </button>
            </SectionCard>

            <SectionCard id="cms-whyus" title="Why Us Section" subtitle="Value proposition cards">
          <Field label="Heading" value={content.whyUs.heading} onChange={(value) => updateSection('whyUs', (s) => ({ ...s, heading: value }))} />
          <Field multiline label="Description" value={content.whyUs.description} onChange={(value) => updateSection('whyUs', (s) => ({ ...s, description: value }))} />
          <div className="space-y-3">
            {content.whyUs.cards.map((card, idx) => (
              <div key={`${card.title}-${idx}`} className="rounded-lg border border-slate-700 p-3">
                <Field label={`Card ${idx + 1} Title`} value={card.title} onChange={(value) => updateSection('whyUs', (s) => {
                  const cards = [...s.cards];
                  cards[idx] = { ...cards[idx], title: value };
                  return { ...s, cards };
                })} />
                <Field multiline label={`Card ${idx + 1} Description`} value={card.desc} onChange={(value) => updateSection('whyUs', (s) => {
                  const cards = [...s.cards];
                  cards[idx] = { ...cards[idx], desc: value };
                  return { ...s, cards };
                })} />
                <Field label={`Card ${idx + 1} Icon (zap|target|users|shield)`} value={card.icon} onChange={(value) => updateSection('whyUs', (s) => {
                  const cards = [...s.cards];
                  cards[idx] = { ...cards[idx], icon: value };
                  return { ...s, cards };
                })} />
                <button
                  type="button"
                  onClick={() => updateSection('whyUs', (s) => ({ ...s, cards: s.cards.filter((_, i) => i !== idx) }))}
                  className="text-sm rounded-md border border-red-500/40 text-red-300 px-3 py-2 hover:bg-red-500/10"
                >
                  Remove Card
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => updateSection('whyUs', (s) => ({
                ...s,
                cards: [...s.cards, { title: 'New Reason', desc: 'Describe this reason.', icon: 'zap' }],
              }))}
              className="text-sm rounded-md border border-emerald-500/40 text-emerald-300 px-3 py-2 hover:bg-emerald-500/10"
            >
              Add Card
            </button>
          </div>
            </SectionCard>

            <SectionCard id="cms-cta" title="Call To Action" subtitle="Final conversion block">
          <Field label="Heading" value={content.cta.heading} onChange={(value) => updateSection('cta', (s) => ({ ...s, heading: value }))} />
          <Field multiline label="Description" value={content.cta.description} onChange={(value) => updateSection('cta', (s) => ({ ...s, description: value }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Button Label" value={content.cta.button.label} onChange={(value) => updateSection('cta', (s) => ({ ...s, button: { ...s.button, label: value } }))} />
            <Field label="Button URL" value={content.cta.button.href} onChange={(value) => updateSection('cta', (s) => ({ ...s, button: { ...s.button, href: value } }))} />
          </div>
            </SectionCard>

            <SectionCard id="cms-footer" title="Footer" subtitle="About copy and legal links">
          <Field multiline label="About Text" value={content.footer.about} onChange={(value) => updateSection('footer', (s) => ({ ...s, about: value }))} />
          <Field label="Bottom Line" value={content.footer.bottomLine} onChange={(value) => updateSection('footer', (s) => ({ ...s, bottomLine: value }))} />
          <h4 className="text-sm uppercase tracking-wide text-slate-400 mb-2">Quick Links</h4>
          <LinkEditor links={content.footer.quickLinks} onChange={(quickLinks) => updateSection('footer', (s) => ({ ...s, quickLinks }))} />
          <h4 className="text-sm uppercase tracking-wide text-slate-400 mt-4 mb-2">Legal Links</h4>
          <LinkEditor links={content.footer.legalLinks} onChange={(legalLinks) => updateSection('footer', (s) => ({ ...s, legalLinks }))} />
            </SectionCard>
          </div>

          <aside className="xl:sticky xl:top-24">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsPreviewOpen((prev) => !prev)}
                className="w-full text-left px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/70 hover:from-slate-800 hover:to-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-300">Live Preview</h2>
                  <span className="text-slate-300 text-sm">{isPreviewOpen ? 'Hide' : 'Edit'}</span>
                </div>
              </button>

              {isPreviewOpen && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-slate-400">Preview Controls</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setInlineHeroEdit((prev) => !prev)}
                        className={`text-xs rounded-md border px-2 py-1 ${inlineHeroEdit ? 'border-emerald-400/60 text-emerald-300 bg-emerald-400/10' : 'border-slate-600 text-slate-300 hover:border-amber-400/60 hover:text-amber-300'}`}
                      >
                        {inlineHeroEdit ? 'Inline Edit On' : 'Inline Edit Off'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewKey((prev) => prev + 1)}
                        className="text-xs rounded-md border border-slate-600 px-2 py-1 text-slate-300 hover:border-amber-400/60 hover:text-amber-300"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                {[
                  { id: 'desktop', label: 'Desktop' },
                  { id: 'tablet', label: 'Tablet' },
                  { id: 'mobile', label: 'Mobile' },
                ].map((device) => (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => setPreviewDevice(device.id)}
                    className={`text-xs rounded-md border px-2 py-1 ${previewDevice === device.id ? 'border-amber-400 text-amber-300 bg-amber-400/10' : 'border-slate-600 text-slate-300 hover:border-slate-400'}`}
                  >
                    {device.label}
                  </button>
                ))}
                  </div>

                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Section Preview</p>
                    <div className="flex flex-wrap gap-2">
                      {previewSectionOptions.map((section) => (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => setPreviewSection(section.id)}
                          className={`text-xs rounded-md border px-2 py-1 ${previewSection === section.id ? 'border-emerald-400 text-emerald-300 bg-emerald-400/10' : 'border-slate-600 text-slate-300 hover:border-slate-400'}`}
                        >
                          {section.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {inlineHeroEdit && (
                    <div className="rounded-xl border border-emerald-500/30 bg-slate-950/70 p-3 mb-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Inline Hero Edit</p>
                  <input
                    value={content.hero.badgeText}
                    onChange={(e) => updateSection('hero', (s) => ({ ...s, badgeText: e.target.value }))}
                    placeholder="Badge text"
                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={content.hero.titleMain}
                      onChange={(e) => updateSection('hero', (s) => ({ ...s, titleMain: e.target.value }))}
                      placeholder="Title main"
                      className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                    <input
                      value={content.hero.titleHighlight}
                      onChange={(e) => updateSection('hero', (s) => ({ ...s, titleHighlight: e.target.value }))}
                      placeholder="Title highlight"
                      className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <textarea
                    value={content.hero.description}
                    onChange={(e) => updateSection('hero', (s) => ({ ...s, description: e.target.value }))}
                    placeholder="Hero description"
                    className="w-full min-h-[90px] rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={content.hero.primaryButton.label}
                      onChange={(e) => updateSection('hero', (s) => ({ ...s, primaryButton: { ...s.primaryButton, label: e.target.value } }))}
                      placeholder="Primary button label"
                      className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                    <input
                      value={content.hero.primaryButton.href}
                      onChange={(e) => updateSection('hero', (s) => ({ ...s, primaryButton: { ...s.primaryButton, href: e.target.value } }))}
                      placeholder="Primary button URL"
                      className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div className="mt-2 rounded-lg border border-slate-700 bg-slate-900/80 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">Hero Snapshot</p>
                    <p className="text-xs text-amber-300 mb-2">{content.hero.badgeText}</p>
                    <h3 className="text-lg font-extrabold text-white leading-tight">
                      {content.hero.titleMain}{' '}
                      <span className="text-amber-300">{content.hero.titleHighlight}</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-2">{content.hero.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs rounded-md bg-amber-400 text-slate-900 px-2 py-1 font-semibold">{content.hero.primaryButton.label || 'Primary Button'}</span>
                      {heroSecondaryButton.enabled && (
                        <span className="text-xs rounded-md border border-slate-500 text-slate-200 px-2 py-1">{heroSecondaryButton.label || 'Secondary Button'}</span>
                      )}
                    </div>
                  </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-700/80 bg-slate-950 p-2 flex justify-center overflow-auto">
                    <iframe
                      key={`${previewKey}-${previewSection}`}
                      src={previewSrc}
                      title="Website preview"
                      className={`${previewFrameClass} rounded-lg bg-white`}
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
