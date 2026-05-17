import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down.mjs'
import ExternalLink from '#/components/external-link'
import type { Dictionary } from '#/i18n'

interface SourcesSectionProps {
  t: Dictionary
}

const MOBILE_VISIBLE_SOURCE_COUNT = 4
const DESKTOP_VISIBLE_SOURCE_COUNT = 6

export default function SourcesSection({ t }: SourcesSectionProps) {
  const renderSourcesList = (sources: Dictionary['sources']['items']) => (
    <ul className="grid gap-3 md:gap-4">
      {sources.map((source) => (
        <li key={source.href} className="grid gap-1 border-b pb-4 last:border-b-0">
          <p className="m-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {source.source} · {source.type}
          </p>
          <ExternalLink
            href={source.href}
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            {source.label}
          </ExternalLink>
        </li>
      ))}
    </ul>
  )
  const visibleMobileSources = t.sources.items.slice(0, MOBILE_VISIBLE_SOURCE_COUNT)
  const hiddenMobileSources = t.sources.items.slice(MOBILE_VISIBLE_SOURCE_COUNT)
  const visibleDesktopSources = t.sources.items.slice(0, DESKTOP_VISIBLE_SOURCE_COUNT)
  const hiddenDesktopSources = t.sources.items.slice(DESKTOP_VISIBLE_SOURCE_COUNT)
  const renderMoreSourcesToggle = (sources: Dictionary['sources']['items']) => (
    <details className="group grid gap-4">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center gap-2 text-center font-medium marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{t.sources.toggle}</span>
        <span className="hidden group-open:inline">{t.sources.toggleOpen}</span>
        <ChevronDownIcon
          className="size-4 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="pt-3">{renderSourcesList(sources)}</div>
    </details>
  )

  return (
    <section id="sources" className="mx-auto grid max-w-4xl gap-5 px-6 py-20 text-sm md:gap-6 md:py-28">
      <div className="hidden gap-5 md:grid md:gap-6">
        <h2 className="m-0 text-3xl font-semibold tracking-tight">
          {t.sources.title}
        </h2>
        <p className="m-0 text-sm text-muted-foreground">
          {t.sources.lastChecked}
        </p>
        {renderSourcesList(visibleDesktopSources)}
        {renderMoreSourcesToggle(hiddenDesktopSources)}
      </div>
      <div className="grid gap-4 md:hidden">
        <div className="grid gap-1">
          <h2 className="m-0 text-2xl font-semibold tracking-tight">
            {t.sources.title}
          </h2>
          <p className="m-0 text-sm text-muted-foreground">
            {t.sources.lastChecked}
          </p>
        </div>
        {renderSourcesList(visibleMobileSources)}
        {renderMoreSourcesToggle(hiddenMobileSources)}
      </div>
    </section>
  )
}
