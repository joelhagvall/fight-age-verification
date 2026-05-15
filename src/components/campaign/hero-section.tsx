import ArrowRightIcon from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import type { Dictionary } from '#/i18n'
import { buttonVariants } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { scrollToSection } from './scroll'

interface HeroSectionProps {
  t: Dictionary
}

export default function HeroSection({ t }: HeroSectionProps) {
  return (
    <section
      id="main-content"
      className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl flex-col items-center justify-center px-6 py-16 text-center md:py-32"
    >
      <div className="flex flex-col items-center gap-8 md:gap-10">
        <div className="flex flex-col items-center gap-5 md:gap-6">
          <img
            src="/logo-eu-proposal-288.webp"
            alt={t.nav.brand}
            className="size-28 object-contain md:size-36"
            width="144"
            height="144"
            decoding="async"
            fetchPriority="high"
          />
          <h1 className="max-w-5xl text-6xl font-semibold tracking-tight text-balance md:text-8xl">
            {t.hero.title}
          </h1>
          <p className="max-w-3xl text-xl leading-8 text-muted-foreground md:text-2xl md:leading-9">
            {t.hero.lead}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => { scrollToSection('why'); }}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            {t.hero.secondary}
          </button>
          <button
            type="button"
            onClick={() => { scrollToSection('targets'); }}
            className={cn(buttonVariants({ size: 'lg' }))}
          >
            {t.hero.primary}
            <ArrowRightIcon data-icon="inline-end" />
          </button>
        </div>
      </div>
    </section>
  )
}
