// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'
import {
  THEME_STORAGE_KEY,
  readThemePreference,
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
})
