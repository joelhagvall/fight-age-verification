import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link.mjs'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '#/lib/utils'

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
}

export default function ExternalLink({
  children,
  className,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noreferrer"
      className={cn('inline-flex w-fit items-center gap-1.5', className)}
    >
      {children}
      <ExternalLinkIcon className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
    </a>
  )
}
