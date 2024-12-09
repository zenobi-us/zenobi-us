import { useCallback, useMemo } from 'react';
import useParamHash from 'use-hash-param';
import type { z, ZodSchema } from 'zod';

import { isBrowser } from '~/core/is-browser';

export function encode<T>(value: T) {
  const prepared = JSON.stringify(value);
  if (!isBrowser) {
    return Buffer.from(prepared).toString('base64');
  }

  return window.btoa(prepared);
}

export function decode<T>(encoded: string): T | null {
  try {
    if (!isBrowser) {
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      return JSON.parse(decoded);
    }
    const decoded = window.atob(encoded);
    return JSON.parse(decoded);
  } catch (event) {
    console.error('Failed to decode hash', event);
    return {} as T;
  }
}

export function useHashFormState<T extends ZodSchema>(key: string, schema: T) {
  const [hash, setHash] = useParamHash(key, '');

  const value = useMemo(() => {
    if (!hash) {
      return null;
    }
    const decoded = decode<z.infer<T>>(hash);
    const parsed = schema.safeParse(decoded);
    if (parsed.success) {
      return decoded;
    }

    return null;
  }, [hash, schema]);

  const set = useCallback(
    (value: z.infer<T>) => {
      const parsed = schema.safeParse(value);
      if (!parsed.success) {
        return;
      }

      setHash(encode(value));
    },
    [schema, setHash]
  );

  return {
    set,
    hash,
    value,
  };
}
