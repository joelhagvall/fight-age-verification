import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link.mjs'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '#/lib/utils'

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  iconLayout?: 'inline' | 'flex'
}

export default function ExternalLink({
  children,
  className,
  iconLayout = 'inline',
  ...props
}: ExternalLinkProps) {
  if (iconLayout === 'flex') {
    return (
      <a
        {...props}
        target="_blank"
        rel="noreferrer"
        className={cn(className, 'inline-flex w-fit items-center gap-1.5')}
      >
        {children}
        <ExternalLinkIcon className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
      </a>
    )
  }

  return (
    <a
      {...props}
      target="_blank"
      rel="noreferrer"
      className={cn(className, 'inline w-fit')}
    >
      {children}
      <ExternalLinkIcon
        className="ml-1 inline size-3.5 align-[-0.125em] opacity-60"
        aria-hidden="true"
      />
    </a>
  )
}
