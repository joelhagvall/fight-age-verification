import { Link } from '@tanstack/react-router'
import ArrowLeftIcon from 'lucide-react/dist/esm/icons/arrow-left.mjs'
import { writeRestoreHomeScrollPreference } from '#/lib/preferences'

interface BackToCampaignLinkProps {
  label: string
}

export default function BackToCampaignLink({ label }: BackToCampaignLinkProps) {
  function handleBack() {
    writeRestoreHomeScrollPreference()
  }

  return (
    <Link
      to="/"
      resetScroll={false}
      onClick={handleBack}
      className="nav-link mb-16 flex w-fit items-center gap-2 text-sm font-medium"
    >
      <ArrowLeftIcon className="size-4" aria-hidden="true" />
      {label}
    </Link>
  )
}
