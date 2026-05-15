import type { Dictionary } from '#/i18n'

interface SourcesSectionProps {
  t: Dictionary
}

export default function SourcesSection({ t }: SourcesSectionProps) {
  return (
    <section id="sources" className="mx-auto grid max-w-4xl gap-6 px-6 py-28 text-sm">
      <h2 className="m-0 text-3xl font-semibold tracking-tight">
        {t.sources.title}
      </h2>
      <ul className="grid gap-4">
        {t.sources.items.map((source) => (
          <li key={source.href} className="grid gap-1 border-b pb-4 last:border-b-0">
            <p className="m-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {source.source} · {source.type}
            </p>
            <a
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            >
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
