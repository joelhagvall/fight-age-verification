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
      className={cn('inline w-fit', className)}
    >
      {children}
      <ExternalLinkIcon
        className="ml-1 inline size-3.5 align-[-0.125em] opacity-60"
        aria-hidden="true"
      />
    </a>
  )
}
