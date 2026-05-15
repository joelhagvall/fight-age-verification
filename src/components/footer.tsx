import { Link } from '@tanstack/react-router'
import ExternalLink from '#/components/external-link'
import type { Dictionary } from '#/i18n'

interface FooterProps {
  t: Dictionary
}

export default function Footer({ t }: FooterProps) {
  const currentYear = new Date().getFullYear().toString()
  const copyright = t.footer.copyright.replace('{year}', currentYear)

  return (
    <footer className="mt-12 border-t px-4 pb-14 pt-10 text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
        <nav className="flex flex-wrap justify-center gap-4 text-sm">
          <Link className="nav-link" to="/about">
            {t.footer.about}
          </Link>
          <Link className="nav-link" to="/privacy">
            {t.footer.privacy}
          </Link>
          <Link className="nav-link" to="/contact">
            {t.footer.contact}
          </Link>
          <ExternalLink
            className="nav-link inline-flex items-center gap-1.5"
            href={t.footer.sourceHref}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              aria-hidden="true"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.52 2.87 8.36 6.84 9.72.5.1.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.64-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.35 9.35 0 0 1 12 6.96c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.56 5.05.36.32.68.94.68 1.9v2.8c0 .27.18.59.69.49A10.08 10.08 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z" />
            </svg>
            {t.footer.source}
          </ExternalLink>
        </nav>
        <p className="m-0 text-center text-xs">{copyright}</p>
      </div>
    </footer>
  )
}
