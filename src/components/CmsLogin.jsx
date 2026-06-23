import React, { useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

export default function CmsLogin({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message || 'Invalid username or password.');
      return;
    }

    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
        <h1 className="text-2xl font-extrabold mb-2">CMS Access</h1>
        <p className="text-sm text-slate-400 mb-6">Sign in with your Supabase Auth admin credentials to access the CMS.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-slate-400">Username (Email)</span>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wide text-slate-400">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-amber-500 text-slate-900 font-semibold px-4 py-2 hover:bg-amber-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing In...' : 'Access CMS'}
          </button>
        </form>
      </div>
    </div>
  );
}
