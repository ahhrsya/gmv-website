'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Lang } from '@/lib/content'

const STORAGE_KEY = 'gmv_lang'
const DEFAULT_LANG: Lang = 'en'

function isLang(v: unknown): v is Lang {
  return v === 'en' || v === 'id'
}

function readStored(): Lang | null {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return isLang(v) ? v : null
  } catch {
    return null
  }
}

/**
 * Persisted language hook. SSR-safe: server (and first client render) always use
 * `initial` so hydration matches. On mount, swaps to the stored value if one
 * exists. Also syncs across tabs via the `storage` event so changing language
 * in one tab updates the others.
 */
export function usePersistedLang(
  initial: Lang = DEFAULT_LANG
): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>(initial)

  useEffect(() => {
    const stored = readStored()
    if (stored && stored !== lang) setLangState(stored)

    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return
      if (isLang(e.newValue)) setLangState(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
    // Intentionally run only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLang = useCallback((l: Lang) => {
    if (!isLang(l)) return
    setLangState(l)
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // localStorage unavailable (private mode, quota) — silently fall back to
      // in-memory state for this session.
    }
  }, [])

  return [lang, setLang]
}
