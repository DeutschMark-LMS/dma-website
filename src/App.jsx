import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PromoTicker from './components/PromoTicker';
import Hero from './components/Hero';
import Methodology from './components/Methodology';
import Programs from './components/Programs';
import WhyUs from './components/WhyUs';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CmsPanel from './components/CmsPanel';
import CmsLogin from './components/CmsLogin';
import useCmsContent from './hooks/useCmsContent';
import { isSupabaseConfigured, supabase } from './lib/supabaseClient';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCmsAuthenticated, setIsCmsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const {
    content,
    setContent,
    resetContent,
    syncNow,
    syncStatus,
    isCloudEnabled,
  } = useCmsContent();

  const isCmsRoute =
    typeof window !== 'undefined' &&
    window.location.pathname.replace(/\/$/, '') === '/cms';

  const previewSection =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('previewSection') || 'all'
      : 'all';

  const isTickerEnabled = content?.promoTicker?.enabled !== false;

  // Handle scroll effect for the glassmorphic navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsAuthChecking(false);
      return;
    }

    let mounted = true;

    const checkInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setIsCmsAuthenticated(Boolean(data.session));
        setIsAuthChecking(false);
      }
    };

    checkInitialSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsCmsAuthenticated(Boolean(session));
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (isCmsRoute) {
    if (!isSupabaseConfigured) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
            <h1 className="text-2xl font-extrabold mb-2">CMS Login Requires Supabase Auth</h1>
            <p className="text-sm text-slate-300 mb-2">To hide credentials from code, login must be verified server-side.</p>
            <p className="text-sm text-slate-400">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then create an admin user in Supabase Authentication.</p>
          </div>
        </div>
      );
    }

    if (isAuthChecking) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <p className="text-slate-300">Checking CMS session...</p>
        </div>
      );
    }

    if (!isCmsAuthenticated) {
      return (
        <CmsLogin
          onSuccess={() => {
            setIsCmsAuthenticated(true);
          }}
        />
      );
    }

    return (
      <CmsPanel
        content={content}
        setContent={setContent}
        resetContent={resetContent}
        syncNow={syncNow}
        syncStatus={syncStatus}
        isCloudEnabled={isCloudEnabled}
        onLogout={async () => {
          setIsCmsAuthenticated(false);
          if (supabase) {
            await supabase.auth.signOut();
          }
        }}
      />
    );
  }

  const sectionComponents = {
    navbar: (
      <Navbar
        data={content.navbar}
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    ),
    ticker: <PromoTicker data={content.promoTicker} />,
    hero: <Hero data={content.hero} />,
    methodology: <Methodology data={content.methodology} />,
    programs: <Programs data={content.programs} />,
    'why-us': <WhyUs data={content.whyUs} />,
    cta: <CTA data={content.cta} />,
    footer: <Footer data={content.footer} />,
  };

  if (previewSection !== 'all' && sectionComponents[previewSection]) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans selection:bg-amber-500/30">
        {sectionComponents[previewSection]}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-amber-500/30">
      <PromoTicker data={content.promoTicker} fixedTop />
      <Navbar
        data={content.navbar}
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        withTopTicker={isTickerEnabled}
      />
      <Hero data={content.hero} />
      <Methodology data={content.methodology} />
      <Programs data={content.programs} />
      <WhyUs data={content.whyUs} />
      <CTA data={content.cta} />
      <Footer data={content.footer} />
    </div>
  );
}
