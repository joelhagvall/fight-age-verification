// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'
import { defaultLocale } from '#/i18n'
import { applyLocale, applyLocaleAndCleanUrl, parseLocaleSearch } from './locale'
import { installMockLocalStorage } from './test-storage'

describe('locale helpers', () => {
  beforeEach(() => {
    installMockLocalStorage()
    window.dispatchEvent(new Event('pagehide'))
    window.history.replaceState(null, '', '/')
    document.documentElement.lang = defaultLocale
  })

  it('keeps supported locale search params', () => {
    expect(parseLocaleSearch({ lang: 'sv' })).toEqual({ lang: 'sv' })
  })

  it('keeps campaign section search params', () => {
    expect(parseLocaleSearch({ section: 'targets' })).toEqual({ section: 'targets' })
  })

  it('drops unsupported locale search params', () => {
    expect(parseLocaleSearch({ lang: 'de' })).toEqual({})
  })

  it('applies locale to the document language', () => {
    applyLocale('sv')

    expect(document.documentElement.lang).toBe('sv')
  })

  it('cleans locale from the current URL after applying it', () => {
    window.history.replaceState(null, '', '/?section=targets&lang=sv')

    applyLocaleAndCleanUrl('sv')

    expect(document.documentElement.lang).toBe('sv')
    expect(window.location.search).toBe('?section=targets')
  })
})
