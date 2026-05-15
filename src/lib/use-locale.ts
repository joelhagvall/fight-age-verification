import { startTransition, useState } from 'react'
import { dictionaries, defaultLocale, type Locale } from '#/i18n'
import { applyLocale, applyLocaleAndCleanUrl } from '#/lib/locale'
import { readLocalePreference, writeLocalePreference } from '#/lib/preferences'
import { useIsomorphicLayoutEffect } from '#/lib/use-isomorphic-layout-effect'

function initialLocale(lang?: Locale) {
  return lang ?? readLocalePreference() ?? defaultLocale
}

export function useLocale(lang?: Locale, cleanUrl = false) {
  const [locale, setLocale] = useState(() => initialLocale(lang))

  useIsomorphicLayoutEffect(() => {
    const nextLocale = initialLocale(lang)
    startTransition(() => {
      setLocale(nextLocale)
    })
    if (lang) {
      writeLocalePreference(lang)
      if (cleanUrl) {
        applyLocaleAndCleanUrl(nextLocale)
        return
      }

      applyLocale(nextLocale)
      return
    }

    applyLocale(nextLocale)
  }, [lang])

  function toggleLocale() {
    const nextLocale = locale === 'sv' ? 'en' : 'sv'
    startTransition(() => {
      setLocale(nextLocale)
    })
    writeLocalePreference(nextLocale)
    applyLocaleAndCleanUrl(nextLocale)
  }

  return {
    locale,
    t: dictionaries[locale],
    toggleLocale,
  }
}
