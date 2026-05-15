import en from './en.json'
import sv from './sv.json'

export const dictionaries = { en, sv }

export type Locale = keyof typeof dictionaries
export type Dictionary = (typeof dictionaries)[Locale]
export type PageKey = keyof Dictionary['pages']

export const defaultLocale: Locale = 'en'

function localizedPageMeta(page: Exclude<PageKey, 'back'>, locale?: Locale) {
  const t = dictionaries[locale ?? defaultLocale]
  const pageContent = t.pages[page]
  const title = `${pageContent.title} | ${t.meta.title}`

  return {
    title,
    description: pageContent.body,
  }
}

export function localizedHeadMeta(page: Exclude<PageKey, 'back'>, locale?: Locale) {
  const meta = localizedPageMeta(page, locale)

  return [
    { title: meta.title },
    { name: 'description', content: meta.description },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { name: 'twitter:title', content: meta.title },
    { name: 'twitter:description', content: meta.description },
  ]
}
