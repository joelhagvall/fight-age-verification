import { startTransition, useEffect, useState } from 'react'
import { dictionaries, defaultLocale, type Locale } from '#/i18n'
import { applyLocale, persistLocaleInUrl } from '#/lib/locale'

export function useLocale(lang?: Locale) {
  const [locale, setLocale] = useState(lang ?? defaultLocale)

  useEffect(() => {
    const nextLocale = lang ?? defaultLocale
    startTransition(() => {
      setLocale(nextLocale)
    })
    applyLocale(nextLocale)
  }, [lang])

  function toggleLocale() {
    const nextLocale = locale === 'sv' ? 'en' : 'sv'
    startTransition(() => {
      setLocale(nextLocale)
    })
    persistLocaleInUrl(nextLocale)
  }

  return {
    locale,
    t: dictionaries[locale],
    toggleLocale,
  }
}
