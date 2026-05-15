import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import CampaignPage from '#/components/campaign-page'
import Footer from '#/components/footer'
import Header from '#/components/header'
import { parseLocaleSearch } from '#/lib/locale'
import { useLocale } from '#/lib/use-locale'

export const Route = createFileRoute('/')({
  validateSearch: parseLocaleSearch,
  component: App,
})

function App() {
  const { lang } = Route.useSearch()
  const { locale, t, toggleLocale } = useLocale(lang)

  useEffect(() => {
    const sectionId = new URLSearchParams(window.location.search).get('section')
    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ block: 'start' })
      return
    }

    const saved = sessionStorage.getItem('home:scrollY')
    if (saved) window.scrollTo(0, parseInt(saved, 10))

    const save = () => {
      sessionStorage.setItem('home:scrollY', String(window.scrollY))
    }
    window.addEventListener('scroll', save, { passive: true })
    return () => {
      window.removeEventListener('scroll', save)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t.nav.skipContent}
      </a>
      <Header t={t} locale={locale} onToggleLocale={toggleLocale} />
      <CampaignPage t={t} />
      <Footer t={t} locale={locale} />
    </>
  )
}
