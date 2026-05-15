import { createFileRoute } from '@tanstack/react-router'
import BackToCampaignLink from '#/components/back-to-campaign-link'
import ExternalLink from '#/components/external-link'
import Footer from '#/components/footer'
import Header from '#/components/header'
import { localizedHeadMeta } from '#/i18n'
import { parseLocaleSearch } from '#/lib/locale'
import { useLocale } from '#/lib/use-locale'

export const Route = createFileRoute('/about')({
  validateSearch: parseLocaleSearch,
  head: ({ match }) => ({ meta: localizedHeadMeta('about', match.search.lang) }),
  component: About,
})

function About() {
  const { lang } = Route.useSearch()
  const { locale, t, toggleLocale } = useLocale(lang)

  return (
    <>
      <Header t={t} locale={locale} onToggleLocale={toggleLocale} />
      <main className="mx-auto min-h-[70svh] max-w-3xl px-6 pb-20 pt-28 text-center">
        <BackToCampaignLink label={t.pages.back} />
        <h1 className="text-5xl font-semibold tracking-tight">
          {t.pages.about.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {t.pages.about.body}
        </p>
        <div className="mt-12 grid gap-6 text-left">
          {t.pages.about.sections.map((section) => (
            <section key={section.title} className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {section.body}
              </p>
              {'href' in section ? (
                <ExternalLink
                  href={section.href}
                  className="nav-link mt-4 inline-flex break-all text-sm font-medium underline underline-offset-4"
                >
                  {section.link}
                </ExternalLink>
              ) : null}
            </section>
          ))}
        </div>
      </main>
      <Footer t={t} />
    </>
  )
}
