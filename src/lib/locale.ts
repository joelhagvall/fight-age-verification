import type { Locale } from '#/i18n'

interface LocaleSearch {
  lang?: unknown
  section?: unknown
}

export function parseLocaleSearch(search: LocaleSearch): {
  lang?: Locale
  section?: string
} {
  return {
    ...(search.lang === 'en' || search.lang === 'sv' ? { lang: search.lang } : {}),
    ...(typeof search.section === 'string' ? { section: search.section } : {}),
  }
}

export function applyLocale(locale: Locale) {
  document.documentElement.lang = locale
}

export function removeLocaleFromUrl() {
  const url = new URL(window.location.href)
  if (!url.searchParams.has('lang')) {
    return
  }

  url.searchParams.delete('lang')
  window.history.replaceState(null, '', url)
}

export function applyLocaleAndCleanUrl(locale: Locale) {
  applyLocale(locale)
  removeLocaleFromUrl()
}
