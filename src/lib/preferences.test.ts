// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'
import {
  LOCALE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  readLocalePreference,
  readThemePreference,
  writeLocalePreference,
  writeThemePreference,
} from './preferences'
import { installMockLocalStorage } from './test-storage'

describe('preferences', () => {
  beforeEach(() => {
    installMockLocalStorage()
  })

  it('migrates a legacy theme preference to the versioned key', () => {
    window.localStorage.setItem('theme', 'light')

    expect(readThemePreference()).toBe('light')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(window.localStorage.getItem('theme')).toBeNull()
  })

  it('writes theme preferences to the versioned key and removes legacy values', () => {
    window.localStorage.setItem('theme', 'dark')

    writeThemePreference('light')

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(window.localStorage.getItem('theme')).toBeNull()
  })

  it('reads and writes locale preferences', () => {
    writeLocalePreference('sv')

    expect(readLocalePreference()).toBe('sv')
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('sv')
  })
})
