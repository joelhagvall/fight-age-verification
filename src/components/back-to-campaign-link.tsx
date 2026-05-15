import { Link } from '@tanstack/react-router'
import ArrowLeftIcon from 'lucide-react/dist/esm/icons/arrow-left.mjs'
import type { Locale } from '#/i18n'

interface BackToCampaignLinkProps {
  locale: Locale
  label: string
}

export default function BackToCampaignLink({ locale, label }: BackToCampaignLinkProps) {
  function handleBack(event: React.MouseEvent<HTMLAnchorElement>) {
    if (window.history.length > 1) {
      event.preventDefault()
      window.history.back()
    }
  }

  return (
    <Link
      to="/"
      search={{ lang: locale }}
      onClick={handleBack}
      className="nav-link mb-16 flex w-fit items-center gap-2 text-sm font-medium"
    >
      <ArrowLeftIcon className="size-4" aria-hidden="true" />
      {label}
    </Link>
  )
}
