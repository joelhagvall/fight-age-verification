import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link.mjs'
import LandmarkIcon from 'lucide-react/dist/esm/icons/landmark.mjs'
import ScaleIcon from 'lucide-react/dist/esm/icons/scale.mjs'
import ShieldAlertIcon from 'lucide-react/dist/esm/icons/shield-alert.mjs'
import type { Dictionary } from '#/i18n'

interface IssueSectionProps {
  t: Dictionary
}

const issueIcons = [LandmarkIcon, ScaleIcon, ShieldAlertIcon] as const

export default function IssueSection({ t }: IssueSectionProps) {
  return (
    <section id="issue" className="mx-auto grid max-w-4xl gap-8 px-6 py-20">
      <h2 className="text-center text-4xl font-semibold tracking-tight text-balance">
        {t.issue.title}
      </h2>
      <p className="mx-auto max-w-3xl text-center text-lg leading-8 text-muted-foreground">
        {t.issue.lead}
      </p>
      <div className="grid gap-0 border-y">
        {t.issue.items.map((item, index) => {
          const Icon = issueIcons[index] ?? ShieldAlertIcon

          return (
            <div
              className="calm-reveal-stagger grid gap-3 border-b py-6 last:border-b-0 sm:grid-cols-[auto_1fr] sm:gap-5"
              key={item.label}
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="grid gap-1">
                <h3 className="m-0 text-lg font-semibold">{item.label}</h3>
                <p className="m-0 text-sm leading-6 text-muted-foreground">
                  {item.text}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.sources.map((source) => (
                    <a
                      key={source.href}
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
                    >
                      {source.label}
                      <ExternalLinkIcon
                        className="size-3 opacity-60"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

