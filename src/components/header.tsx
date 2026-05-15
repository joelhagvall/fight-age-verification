import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import MenuIcon from 'lucide-react/dist/esm/icons/menu.mjs'
import XIcon from 'lucide-react/dist/esm/icons/x.mjs'
import type { Dictionary } from '#/i18n'
import { buttonVariants } from '#/components/ui/button'
import { writeLocalePreference } from '#/lib/preferences'
import { cn } from '#/lib/utils'
import ThemeToggle from './theme-toggle'

interface HeaderProps {
  t: Dictionary
  locale: 'en' | 'sv'
  onToggleLocale: () => void
}

const HOME_SECTIONS = ['top', 'issue', 'why', 'targets', 'sources'] as const
type HomeSectionId = (typeof HOME_SECTIONS)[number]

export default function Header({ t, locale, onToggleLocale }: HeaderProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [activeSection, setActiveSection] = useState<HomeSectionId>('top')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isHomeRoute = pathname === '/'
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isHomeRoute) {
      return
    }

    const sections = HOME_SECTIONS.map((sectionId) =>
      document.getElementById(sectionId)
    ).filter((section): section is HTMLElement => Boolean(section))

    function updateActiveSection() {
      if (window.scrollY < 80) {
        setActiveSection((current) => (current === 'top' ? current : 'top'))
        return
      }

      const marker = window.innerHeight * 0.35
      let nextSection: HomeSectionId = 'top'
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) {
          nextSection = section.id as HomeSectionId
        }
      }

      setActiveSection((current) =>
        current === nextSection ? current : nextSection
      )
    }

    function scheduleActiveSectionUpdate() {
      if (frameRef.current !== null) {
        return
      }

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null
        updateActiveSection()
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true })

    return () => {
      window.removeEventListener('scroll', scheduleActiveSectionUpdate)
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [isHomeRoute])

  function scrollToSection(sectionId: HomeSectionId) {
    const section = document.getElementById(sectionId)
    if (!section) {
      return
    }

    const headerOffset = 72
    const top = section.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
    setActiveSection(sectionId)
    setIsMenuOpen(false)
  }

  const navItems: {
    id: HomeSectionId
    label: string
    className?: string
    translate?: 'no'
  }[] = [
    { id: 'top', label: t.nav.brand, className: 'font-medium', translate: 'no' },
    { id: 'issue', label: t.nav.issue },
    { id: 'why', label: t.nav.why },
    { id: 'targets', label: t.nav.targets },
    { id: 'sources', label: t.nav.sources },
  ]

  function homeSearch(sectionId: HomeSectionId) {
    return sectionId === 'top'
      ? { lang: locale }
      : { lang: locale, section: sectionId }
  }

  function renderNavItem(
    item: (typeof navItems)[number],
    className: string
  ) {
    const activeClassName = activeSection === item.id ? 'nav-link-active' : undefined

    if (!isHomeRoute) {
      return (
        <Link
          key={item.id}
          to="/"
          search={homeSearch(item.id)}
          onMouseDown={() => { writeLocalePreference(locale); }}
          onClick={() => {
            writeLocalePreference(locale)
            setIsMenuOpen(false)
          }}
          aria-current={activeSection === item.id ? 'page' : undefined}
          className={cn(className, item.className, activeClassName)}
          translate={item.translate}
        >
          {item.label}
        </Link>
      )
    }

    return (
      <button
        key={item.id}
        type="button"
        onMouseDown={(event) => { event.preventDefault(); }}
        onClick={() => { scrollToSection(item.id); }}
        aria-current={activeSection === item.id ? 'page' : undefined}
        className={cn(className, item.className, activeClassName)}
        translate={item.translate}
      >
        {item.label}
      </button>
    )
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/95 backdrop-blur">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2.5 md:justify-center md:px-6 md:py-4">
        {isHomeRoute ? (
          <button
            type="button"
            onMouseDown={(event) => { event.preventDefault(); }}
            onClick={() => { scrollToSection('top'); }}
            className="nav-link font-medium md:hidden"
            translate="no"
          >
            {t.nav.brand}
          </button>
        ) : (
          <Link
            to="/"
            search={{ lang: locale }}
            onMouseDown={() => { writeLocalePreference(locale); }}
            onClick={() => { writeLocalePreference(locale); }}
            className="nav-link font-medium md:hidden"
            translate="no"
          >
            {t.nav.brand}
          </Link>
        )}

        <div className="hidden items-center justify-center gap-6 text-sm text-muted-foreground md:flex">
          {navItems.map((item) => (
            renderNavItem(item, 'nav-link inline-flex items-center gap-2')
          ))}
        </div>

        <div className="hidden items-center justify-center gap-2 md:absolute md:right-6 md:top-1/2 md:flex md:-translate-y-1/2">
          <button
            type="button"
            onMouseDown={(event) => { event.preventDefault(); }}
            onClick={onToggleLocale}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            {t.nav.language}
          </button>
          <ThemeToggle t={t} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onMouseDown={(event) => { event.preventDefault(); }}
            onClick={onToggleLocale}
            className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
          >
            {t.nav.language}
          </button>
          <button
            type="button"
            onClick={() => { setIsMenuOpen((current) => !current); }}
            aria-label={isMenuOpen ? t.nav.menuClose : t.nav.menuOpen}
            aria-expanded={isMenuOpen}
            className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
          >
            {isMenuOpen ? <XIcon aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
          </button>
        </div>

      </nav>
      {isMenuOpen ? (
        <div className="fixed inset-0 top-16 z-40 bg-background/70 backdrop-blur-sm md:hidden">
          <div className="ml-auto flex h-[calc(100svh-4rem)] w-[min(22rem,86vw)] flex-col border-l bg-background px-6 py-6 shadow-xl">
            <div className="grid gap-1 text-base">
              {navItems.map((item) => (
                renderNavItem(
                  item,
                  'nav-link flex min-h-12 items-center justify-between rounded-md px-2 text-left'
                )
              ))}
            </div>

            <div className="mt-auto flex items-center gap-2 border-t pt-5">
              <ThemeToggle t={t} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
