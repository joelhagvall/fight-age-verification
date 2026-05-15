import type { Locale } from '#/i18n'

export type ThemeMode = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'fight-age-verification:theme:v1'
export const LOCALE_STORAGE_KEY = 'fight-age-verification:locale:v1'
export const HOME_SCROLL_KEY = 'fight-age-verification:home-scroll-y'
export const RESTORE_HOME_SCROLL_KEY = 'fight-age-verification:restore-home-scroll'

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

function readSessionStorage(key: string) {
  if (!isBrowser()) {
    return null
  }

  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeSessionStorage(key: string, value: string) {
  if (!isBrowser()) {
    return
  }

  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
}

function removeSessionStorage(key: string) {
  if (!isBrowser()) {
    return
  }

  try {
    window.sessionStorage.removeItem(key)
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

export function readLocalePreference(): Locale | null {
  const stored = readStorage(LOCALE_STORAGE_KEY)
  return stored === 'en' || stored === 'sv' ? stored : null
}

export function writeLocalePreference(locale: Locale) {
  writeStorage(LOCALE_STORAGE_KEY, locale)
}

export function readHomeScrollPosition() {
  const stored = readSessionStorage(HOME_SCROLL_KEY)
  const scrollY = Number(stored)

  return Number.isFinite(scrollY) ? scrollY : null
}

export function writeHomeScrollPosition(scrollY: number) {
  writeSessionStorage(HOME_SCROLL_KEY, String(scrollY))
}

export function readRestoreHomeScrollPreference() {
  return readSessionStorage(RESTORE_HOME_SCROLL_KEY) === 'true'
}

export function writeRestoreHomeScrollPreference() {
  writeSessionStorage(RESTORE_HOME_SCROLL_KEY, 'true')
}

export function clearRestoreHomeScrollPreference() {
  removeSessionStorage(RESTORE_HOME_SCROLL_KEY)
}
