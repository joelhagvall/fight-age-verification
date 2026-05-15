import { createFileRoute } from '@tanstack/react-router'
import CampaignPage from '#/components/campaign-page'
import Footer from '#/components/footer'
import Header from '#/components/header'
import { parseLocaleSearch } from '#/lib/locale'
import { useIsomorphicLayoutEffect } from '#/lib/use-isomorphic-layout-effect'
import { useLocale } from '#/lib/use-locale'

const HOME_SCROLL_KEY = 'fight-age-verification:home-scroll-y'
const RESTORE_HOME_SCROLL_KEY = 'fight-age-verification:restore-home-scroll'

export const Route = createFileRoute('/')({
  validateSearch: parseLocaleSearch,
  component: App,
})

function App() {
  const { lang } = Route.useSearch()
  const { locale, t, toggleLocale } = useLocale(lang, true)

  useIsomorphicLayoutEffect(() => {
    const sectionId = new URLSearchParams(window.location.search).get('section')
    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ block: 'start' })
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (sessionStorage.getItem(RESTORE_HOME_SCROLL_KEY) === 'true') {
      sessionStorage.removeItem(RESTORE_HOME_SCROLL_KEY)
      const savedScrollY = Number(sessionStorage.getItem(HOME_SCROLL_KEY))
      if (Number.isFinite(savedScrollY)) {
        restoreScrollPosition(savedScrollY)
      }
    }
  })

  useIsomorphicLayoutEffect(() => {
    function saveScrollPosition() {
      sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY))
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
    window.addEventListener('scroll', saveScrollPosition, { passive: true })

    return () => {
      saveScrollPosition()
      document.removeEventListener('click', saveBeforeLeavingHome, { capture: true })
      window.removeEventListener('scroll', saveScrollPosition)
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
