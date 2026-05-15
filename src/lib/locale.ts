import type { Locale } from '#/i18n'

interface LocaleSearch {
  lang?: unknown
}

export function parseLocaleSearch(search: LocaleSearch): { lang?: Locale } {
  return search.lang === 'en' || search.lang === 'sv' ? { lang: search.lang } : {}
}

export function applyLocale(locale: Locale) {
  document.documentElement.lang = locale
}

export function persistLocaleInUrl(locale: Locale) {
  applyLocale(locale)

  const url = new URL(window.location.href)
  url.searchParams.set('lang', locale)
  window.history.replaceState(null, '', url)
}
