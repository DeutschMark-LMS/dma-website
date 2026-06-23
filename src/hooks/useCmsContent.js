import { useEffect, useMemo, useRef, useState } from 'react';
import defaultContent from '../content/defaultContent';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'dma-cms-content-v1';
const CMS_TABLE = 'cms_content';
const CMS_ROW_ID = 'main';

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function useCmsContent() {
  const [content, setContentState] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultContent;
    }

    const saved = safeParse(window.localStorage.getItem(STORAGE_KEY));
    return saved || defaultContent;
  });

  const [syncStatus, setSyncStatus] = useState(
    isSupabaseConfigured
      ? 'Cloud sync enabled'
      : 'Local mode only (Supabase env not configured)',
  );
  const [isHydrated, setIsHydrated] = useState(!isSupabaseConfigured);
  const lastSyncedRef = useRef('');

  const writeToLocalStorage = (next) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  };

  const markLocalSaved = () => {
    setSyncStatus('Saved locally');
  };

  const syncToCloud = async (next) => {
    if (!isSupabaseConfigured || !supabase) {
      markLocalSaved();
      return true;
    }

    setSyncStatus('Syncing to Supabase...');

    const { error } = await supabase
      .from(CMS_TABLE)
      .upsert({ id: CMS_ROW_ID, content: next }, { onConflict: 'id' });

    if (error) {
      setSyncStatus(`Supabase sync failed: ${error.message}`);
      return false;
    }

    lastSyncedRef.current = JSON.stringify(next);
    setSyncStatus('Synced with Supabase');
    return true;
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    let cancelled = false;

    const loadCloudContent = async () => {
      setSyncStatus('Loading content from Supabase...');

      const { data, error } = await supabase
        .from(CMS_TABLE)
        .select('content')
        .eq('id', CMS_ROW_ID)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      if (error) {
        setSyncStatus(`Supabase load failed: ${error.message}`);
        setIsHydrated(true);
        return;
      }

      if (data?.content) {
        setContentState(data.content);
        writeToLocalStorage(data.content);
        lastSyncedRef.current = JSON.stringify(data.content);
        setSyncStatus('Synced with Supabase');
      } else {
        await syncToCloud(defaultContent);
      }

      setIsHydrated(true);
    };

    loadCloudContent();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !isHydrated) {
      return;
    }

    const serialized = JSON.stringify(content);
    if (serialized === lastSyncedRef.current) {
      return;
    }

    const timeout = window.setTimeout(() => {
      syncToCloud(content);
    }, 700);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [content, isHydrated]);

  const api = useMemo(
    () => ({
      content,
      setContent: (nextValue) => {
        setContentState((prev) => {
          const next = typeof nextValue === 'function' ? nextValue(prev) : nextValue;
          writeToLocalStorage(next);
          if (!isSupabaseConfigured) {
            markLocalSaved();
          }
          return next;
        });
      },
      resetContent: async () => {
        setContentState(defaultContent);
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        await syncToCloud(defaultContent);
      },
      syncNow: async () => {
        writeToLocalStorage(content);
        return syncToCloud(content);
      },
      syncStatus,
      isCloudEnabled: isSupabaseConfigured,
    }),
    [content, syncStatus],
  );

  return api;
}
