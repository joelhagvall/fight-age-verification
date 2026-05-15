export type ThemeMode = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'fight-age-verification:theme:v1'

const LEGACY_THEME_STORAGE_KEY = 'theme'

function isBrowser() {
  return typeof window !== 'undefined'
}

function readStorage(key: string) {
  if (!isBrowser()) {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  if (!isBrowser()) {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
}

function removeStorage(key: string) {
  if (!isBrowser()) {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
}

export function readThemePreference(): ThemeMode | null {
  const stored = readStorage(THEME_STORAGE_KEY) ?? readStorage(LEGACY_THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    writeStorage(THEME_STORAGE_KEY, stored)
    removeStorage(LEGACY_THEME_STORAGE_KEY)
    return stored
  }

  return null
}

export function writeThemePreference(mode: ThemeMode) {
  writeStorage(THEME_STORAGE_KEY, mode)
  removeStorage(LEGACY_THEME_STORAGE_KEY)
}
