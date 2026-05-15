import { startTransition, useEffect, useRef, useState } from 'react'
import MoonIcon from 'lucide-react/dist/esm/icons/moon.mjs'
import SunIcon from 'lucide-react/dist/esm/icons/sun.mjs'
import type { Dictionary } from '#/i18n'
import { buttonVariants } from '#/components/ui/button'
import {
  readThemePreference,
  type ThemeMode,
  writeThemePreference,
} from '#/lib/preferences'
import { cn } from '#/lib/utils'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const queryTheme = new URLSearchParams(window.location.search).get('theme')
  if (queryTheme === 'light' || queryTheme === 'dark') {
    return queryTheme
  }

  return readThemePreference() ?? 'light'
}

function applyThemeMode(mode: ThemeMode) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(mode)
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = mode
}

interface ThemeToggleProps {
  t: Dictionary
}

export default function ThemeToggle({ t }: ThemeToggleProps) {
  const [mode, setMode] = useState<ThemeMode>('light')
  const scrollPositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const initialMode = getInitialMode()
    startTransition(() => {
      setMode(initialMode)
    })
    applyThemeMode(initialMode)
  }, [])

  function toggleMode() {
    const { x: scrollX, y: scrollY } = scrollPositionRef.current
    const nextMode = mode === 'light' ? 'dark' : 'light'
    startTransition(() => {
      setMode(nextMode)
    })
    applyThemeMode(nextMode)
    writeThemePreference(nextMode)
    requestAnimationFrame(() => {
      window.scrollTo(scrollX, scrollY)
    })
  }

  const label = mode === 'dark' ? t.nav.themeLight : t.nav.themeDark
  const Icon = mode === 'dark' ? SunIcon : MoonIcon

  return (
    <button
      type="button"
      onPointerDown={() => {
        scrollPositionRef.current = { x: window.scrollX, y: window.scrollY }
      }}
      onMouseDown={(event) => { event.preventDefault(); }}
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
    >
      <Icon aria-hidden="true" />
    </button>
  )
}
