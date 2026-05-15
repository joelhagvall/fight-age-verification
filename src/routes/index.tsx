import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import CampaignPage from '#/components/campaign-page'
import Footer from '#/components/footer'
import Header from '#/components/header'
import { parseLocaleSearch } from '#/lib/locale'
import {
  clearRestoreHomeScrollPreference,
  readHomeScrollPosition,
  readRestoreHomeScrollPreference,
  writeHomeScrollPosition,
} from '#/lib/preferences'
import { useIsomorphicLayoutEffect } from '#/lib/use-isomorphic-layout-effect'
import { useLocale } from '#/lib/use-locale'

export const Route = createFileRoute('/')({
  validateSearch: parseLocaleSearch,
  component: App,
})

function App() {
  const { lang } = Route.useSearch()
  const { locale, t, toggleLocale } = useLocale(lang, true)
  const scrollSaveFrameRef = useRef<number | null>(null)

  useIsomorphicLayoutEffect(() => {
    const sectionId = new URLSearchParams(window.location.search).get('section')
    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ block: 'start' })
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (readRestoreHomeScrollPreference()) {
      clearRestoreHomeScrollPreference()
      const savedScrollY = readHomeScrollPosition()
      if (savedScrollY !== null) {
        restoreScrollPosition(savedScrollY)
      }
    }
  })

  useIsomorphicLayoutEffect(() => {
    function saveScrollPosition() {
      writeHomeScrollPosition(window.scrollY)
    }

    function scheduleScrollPositionSave() {
      if (scrollSaveFrameRef.current !== null) {
        return
      }

      scrollSaveFrameRef.current = requestAnimationFrame(() => {
        scrollSaveFrameRef.current = null
        saveScrollPosition()
      })
    }

    function saveBeforeLeavingHome(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest('a[href]')
      const href = link?.getAttribute('href')
      if (href?.startsWith('/')) {
        saveScrollPosition()
      }
    }

    saveScrollPosition()
    document.addEventListener('click', saveBeforeLeavingHome, { capture: true })
    window.addEventListener('scroll', scheduleScrollPositionSave, { passive: true })

    return () => {
      if (scrollSaveFrameRef.current !== null) {
        cancelAnimationFrame(scrollSaveFrameRef.current)
        scrollSaveFrameRef.current = null
      }
      saveScrollPosition()
      document.removeEventListener('click', saveBeforeLeavingHome, { capture: true })
      window.removeEventListener('scroll', scheduleScrollPositionSave)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t.nav.skipContent}
      </a>
      <Header t={t} locale={locale} onToggleLocale={toggleLocale} />
      <CampaignPage t={t} />
      <Footer t={t} />
    </>
  )
}

function restoreScrollPosition(scrollY: number) {
  window.scrollTo(0, scrollY)
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollY)
  })
  window.setTimeout(() => {
    window.scrollTo(0, scrollY)
  }, 100)
}
