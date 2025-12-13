import { useEffect, useState } from 'react';
import type { BundledLanguage, BundledTheme, Highlighter } from 'shiki';
import { createHighlighter } from 'shiki';

import { SHIKI_THEMES, SHIKI_LANGUAGES } from '~/services/Content/shikiOptions';

interface UseShikiOptions {
  themes?: BundledTheme[];
  languages?: BundledLanguage[];
}

interface UseShikiResult {
  highlighter: Highlighter | null;
  loading: boolean;
  error: Error | null;
}

const DEFAULT_THEMES: BundledTheme[] = [SHIKI_THEMES.dark, SHIKI_THEMES.light];
const DEFAULT_LANGUAGES = SHIKI_LANGUAGES;

/**
 * Hook to initialize Shiki highlighter for browser-side syntax highlighting
 */
export function useShiki(options: UseShikiOptions = {}): UseShikiResult {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const themes = options.themes || DEFAULT_THEMES;
  const languages = options.languages || DEFAULT_LANGUAGES;

  useEffect(() => {
    let cancelled = false;

    createHighlighter({
      themes,
      langs: languages,
    })
      .then((hl) => {
        if (!cancelled) {
          setHighlighter(hl);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []); // Only initialize once

  return { highlighter, loading, error };
}
